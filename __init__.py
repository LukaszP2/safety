"""Safety integration - Home hazard detection and notifications."""
from __future__ import annotations

import os
import copy
import logging
from typing import Any

from homeassistant.components.frontend import (
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from .const import DOMAIN, HAZARD_CATEGORIES
from .coordinator import SafetyCoordinator

_LOGGER = logging.getLogger(__name__)

PLATFORMS = ["sensor", "button", "switch", "number", "text"]

def _perform_auto_discovery(
    hass: HomeAssistant, current_cats: dict[str, Any] | None = None
) -> dict[str, Any]:
    """Auto-discover hazard sensors in the system using strict device_classes."""
    _LOGGER.debug("Starting strict auto-discovery of hazard sensors")

    # Inicjujemy bezpieczną kopię stanu lub pusty słownik
    cat_cfg = current_cats or {}

    # 1. KULOODPORNA INICJALIZACJA: Twarde klucze kategorii
    expected_cats = ["water", "fire", "gas", "temperature", "power"]

    for cat in expected_cats:
        if cat not in cat_cfg:
            cat_cfg[cat] = {}

        # Zapewniamy, że każda kategoria ma wymagane tablice (jeśli jakiejś brakuje)
        for key in [
            "sensors", "actuators", "actions", "notify_push",
            "notify_tts", "notify_lights", "notify_sirens", "predictions"
        ]:
            if key not in cat_cfg[cat] or not isinstance(cat_cfg[cat][key], list):
                cat_cfg[cat][key] = []

        if "custom_msg" not in cat_cfg[cat]:
            cat_cfg[cat]["custom_msg"] = ""

    # 2. BEZPIECZNA INICJALIZACJA: Ustawienia Globalne
    if "global" not in cat_cfg:
        cat_cfg["global"] = {}

    default_global = {
        "push_dnd": True,
        "tts_volume": 80,
        "tts_repeat": False,
        "tts_repeat_interval": 5,
        "light_effect": True,
        "scripts_skip_conditions": False,
        "auto_config": True,
        "use_home_modes": True,
        "global_home_modes": False,
        "use_default_notifications": True,
        "use_custom_messages": True,
        "use_predictions": True,
        "auto_predictions": True,
    }

    # Dopisujemy tylko te klucze globalne, których mogło jeszcze nie być
    for k, v in default_global.items():
        if k not in cat_cfg["global"]:
            cat_cfg["global"][k] = v

    # --- WŁAŚCIWE SKANOWANIE ---
    ent_reg = er.async_get(hass)

    for state in hass.states.async_all():
        domain = state.domain
        if domain not in ("binary_sensor", "sensor"):
            continue

        entity_id = state.entity_id

        # 1. Sprawdzamy stan bieżący
        device_class = state.attributes.get("device_class")

        # 2. Fallback: Sprawdzamy Rejestr Encji
        if not device_class:
            entry = ent_reg.async_get(entity_id)
            if entry:
                device_class = entry.device_class or entry.original_device_class

        if not device_class:
            continue

        # --- STRATEGIA AUTO (Ścisłe dopasowanie klas z bezpiecznym dostępem) ---
        if device_class in ("moisture", "water", "leak", "flood") and (
            entity_id not in cat_cfg["water"]["sensors"]
        ):
            cat_cfg["water"]["sensors"].append(entity_id)

        elif device_class in ("smoke", "fire", "heat") and (
            entity_id not in cat_cfg["fire"]["sensors"]
        ):
            cat_cfg["fire"]["sensors"].append(entity_id)

        elif device_class in ("gas", "volatile_organic_compounds") and (
            entity_id not in cat_cfg["gas"]["sensors"]
        ):
            cat_cfg["gas"]["sensors"].append(entity_id)

        elif device_class == "temperature" and (
            entity_id not in cat_cfg["temperature"]["sensors"]
        ):
            cat_cfg["temperature"]["sensors"].append(entity_id)

        elif device_class in ("power", "energy", "current", "voltage") and (
            entity_id not in cat_cfg["power"]["sensors"]
        ):
            cat_cfg["power"]["sensors"].append(entity_id)

    return cat_cfg

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Safety integration from a config entry."""
    _LOGGER.debug("Setting up Safety integration")

    hass.data.setdefault(DOMAIN, {})
    options = dict(entry.options)

    if "auto_config" not in options:
        options["auto_config"] = entry.data.get("auto_config", True)

    if not options.get("initialized"):
        if options["auto_config"]:
            options["categories"] = _perform_auto_discovery(hass)
        else:
            options["categories"] = {
                cat: {
                    "sensors": [],
                    "actuators": [],
                    "actions": [],
                    "notify_push": [],
                    "notify_tts": [],
                    "notify_lights": [],
                    "notify_sirens": [],
                    "custom_msg": "",
                }
                for cat in HAZARD_CATEGORIES
            }
            # Dodajemy bazowe globalne ustawienia gdy auto_config = False
            options["categories"]["global"] = {
                "push_dnd": True,
                "tts_volume": 80,
                "tts_repeat": False,
                "tts_repeat_interval": 5,
                "light_effect": True,
                "default_title": "",
                "default_msg": "",
                "use_home_modes": False,
                "home_mode_type": "custom",
                "alarm_entity": "",
                "geolocation": True,
                "night_start": "22:00",
                "night_end": "06:00",
            }

        options["initialized"] = True
        hass.config_entries.async_update_entry(entry, options=options)

    try:
        coordinator = SafetyCoordinator(hass, entry, prepared_options=options)
        hass.data[DOMAIN][entry.entry_id] = coordinator

        coordinator.start_monitoring()

    except Exception as err:
        _LOGGER.error("Failed to setup coordinator: %s", err)
        return False

    try:
        async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title="Safety",
            sidebar_icon="mdi:shield-check-outline",
            frontend_url_path="safety",
            config={
                "_panel_custom": {
                    "name": "safety-panel",
                    "module_url": "/local/safety-panel.js",
                }
            },
            require_admin=True,
        )
    except Exception as err:
        _LOGGER.warning("Failed to register frontend panel: %s", err)

    @callback
    def _state_changed_listener(event) -> None:
        new_state = event.data.get("new_state")
        old_state = event.data.get("old_state")

        if not new_state or (old_state and old_state.state == new_state.state):
            return

        # Filtruj tylko sensory i czujniki binarne
        if new_state.domain not in ("binary_sensor", "sensor"):
            return

        if new_state.state in ["on", "True", "above"]:
            for cat, cfg in coordinator.category_config.items():
                if cat == "global":
                    continue  # Zabezpieczenie przed błędem kategorii globalnej
                if new_state.entity_id in cfg.get("sensors", []):
                    hass.async_create_task(
                        coordinator.trigger_alert(new_state.entity_id, force_cat=cat)
                    )

    entry.async_on_unload(
        hass.bus.async_listen("state_changed", _state_changed_listener)
    )

    async def _update_settings_service(call) -> None:
        """Handle settings update service calls."""
        cat = call.data.get("category")
        key = call.data.get("key")
        value = call.data.get("value")

        _LOGGER.info("[service update_settings] START - cat=%s, key=%s", cat, key)

        if cat == "global" and key == "auto_config":
            coordinator.entry_data["auto_config"] = value
            if value is True:
                coordinator.category_config = _perform_auto_discovery(
                    hass, coordinator.category_config.copy()
                )
        else:
            if key in [
                "sensors",
                "actuators",
                "actions",
                "notify_push",
                "notify_tts",
                "notify_lights",
                "notify_sirens",
            ]:
                if isinstance(value, str):
                    value = [value] if value.strip() else []
                elif value is None:
                    value = []

            if cat not in coordinator.category_config:
                coordinator.category_config[cat] = {}
            coordinator.category_config[cat][key] = value

            # 1. Głęboka kopia: wymusza na HA zauważenie zmiany atrybutów!
            coordinator.category_config = copy.deepcopy(coordinator.category_config)

            # 2. Natywny zapis: trwale zapisuje ustawienia do bazy Home Assistant
            new_options = dict(entry.options)
            new_options["categories"] = coordinator.category_config
            hass.config_entries.async_update_entry(entry, options=new_options)

            _LOGGER.debug(
                "[service] Updated coordinator.category_config[%s][%s]", cat, key
            )

        # Bezpieczna aktualizacja sensora
        sensor_obj = getattr(coordinator, "sensor", None)
        if sensor_obj and hasattr(sensor_obj, "update_internal_state"):
            _LOGGER.info(
                "[service] ✅ Updating sensor state - coordinator.sensor EXISTS"
            )
            sensor_obj.update_internal_state()

            # Wymuszamy natychmiastowe rozesłanie zmian do HA (żeby JS to zapamiętał!)
            if hasattr(sensor_obj, "async_write_ha_state"):
                sensor_obj.async_write_ha_state()

            _LOGGER.info("[service] Sensor state written to hass")
        else:
            _LOGGER.error("[service] ❌ coordinator.sensor is MISSING!")

        _LOGGER.info("[service update_settings] END")

    hass.services.async_register(DOMAIN, "update_settings", _update_settings_service)

    # === NOWY SERWIS: TRYB SERWISOWY ===
    async def _toggle_service_mode_service(call) -> None:
        """Toggle global service mode."""
        current_state = getattr(coordinator, "global_service_mode", False)
        coordinator.global_service_mode = not current_state

        _LOGGER.info(
            "[service toggle_service_mode] Set to: %s",
            coordinator.global_service_mode,
        )

        sensor_obj = getattr(coordinator, "sensor", None)
        if sensor_obj and hasattr(sensor_obj, "update_internal_state"):
            sensor_obj.update_internal_state()
            if hasattr(sensor_obj, "async_write_ha_state"):
                sensor_obj.async_write_ha_state()
            _LOGGER.info("[service toggle_service_mode] Sensor updated")
        else:
            _LOGGER.error("[service toggle_service_mode] Sensor missing!")

    hass.services.async_register(
        DOMAIN, "toggle_service_mode", _toggle_service_mode_service
    )
    # ===================================

    device_registry = dr.async_get(hass)
    device_registry.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, entry.entry_id)},
        name="Safety: Central Hub",
        manufacturer="Safety Systems",
        model="Main Controller",
    )

    try:
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    except Exception as err:
        _LOGGER.error("Failed to set up platforms: %s", err)
        return False

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    coordinator.start_monitoring()

    _LOGGER.debug("Safety integration setup completed successfully")
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    # Celowo ignorujemy przeładowanie! Zapis odbywa się w tle
    # bez uciążliwego resetowania interfejsu użytkownika.
    _LOGGER.debug("Safety configuration saved natively in the background")


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    _LOGGER.debug("Unloading Safety integration")

    async_remove_panel(hass, "safety")

    coordinator = hass.data[DOMAIN].get(entry.entry_id)
    if coordinator:
        coordinator.stop_monitoring()

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok and entry.entry_id in hass.data[DOMAIN]:
        hass.data[DOMAIN].pop(entry.entry_id)

    # Wyrejestruj serwisy
    hass.services.async_remove(DOMAIN, "update_settings")
    hass.services.async_remove(DOMAIN, "toggle_service_mode")

    return unload_ok
