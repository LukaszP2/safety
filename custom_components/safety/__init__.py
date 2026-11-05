"""Safety integration - Home hazard detection and notifications."""

from __future__ import annotations

import copy
import logging

from homeassistant.components.frontend import (
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr

from .const import DOMAIN, HAZARD_CATEGORIES
from .coordinator import SafetyCoordinator
from .discovery import perform_auto_discovery

_LOGGER = logging.getLogger(__name__)

PLATFORMS = ["sensor", "button", "switch", "number", "text"]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Safety integration from a config entry."""
    _LOGGER.debug("Setting up Safety integration")

    hass.data.setdefault(DOMAIN, {})
    options = dict(entry.options)

    if "auto_config" not in options:
        options["auto_config"] = entry.data.get("auto_config", True)

    if not options.get("initialized"):
        if options["auto_config"]:
            options["categories"] = perform_auto_discovery(hass)
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
                    # Zmienione na nową, wewnętrzną ścieżkę z HACS!
                    "module_url": "/local/safety-panel.js?v=2",
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

        if cat == "global" and key == "auto_config_sensors":
            # Włączenie auto-konfiguracji sensorów
            if value is True:
                # Wyczyść obecne sensory i wykonaj auto-discovery
                for cat_key in HAZARD_CATEGORIES:
                    if cat_key in coordinator.category_config:
                        coordinator.category_config[cat_key]["sensors"] = []
                coordinator.category_config = perform_auto_discovery(
                    hass, coordinator.category_config.copy()
                )
                _LOGGER.info("Auto-discovery sensors enabled - sensors updated")
            # Wyłączenie auto-konfiguracji sensorów - nic nie robimy, użytkownik może edytować
            coordinator.category_config["global"]["auto_config_sensors"] = value

            # Głęboka kopia i zapis do bazy
            coordinator.category_config = copy.deepcopy(coordinator.category_config)
            new_options = dict(entry.options)
            new_options["categories"] = coordinator.category_config
            hass.config_entries.async_update_entry(entry, options=new_options)
            _LOGGER.info("Auto-config sensors saved to database")

        elif cat == "global" and key == "auto_config_actuators":
            # Włączenie auto-konfiguracji aktuatorów
            if value is True:
                # Wyczyść obecne aktuatory i wykonaj auto-discovery
                for cat_key in HAZARD_CATEGORIES:
                    if cat_key in coordinator.category_config:
                        coordinator.category_config[cat_key]["actuators"] = []
                coordinator.category_config = perform_auto_discovery(
                    hass, coordinator.category_config.copy()
                )
                _LOGGER.info("Auto-discovery actuators enabled - actuators updated")
            # Wyłączenie auto-konfiguracji aktuatorów - nic nie robimy, użytkownik może edytować
            coordinator.category_config["global"]["auto_config_actuators"] = value

            # Głęboka kopia i zapis do bazy
            coordinator.category_config = copy.deepcopy(coordinator.category_config)
            new_options = dict(entry.options)
            new_options["categories"] = coordinator.category_config
            hass.config_entries.async_update_entry(entry, options=new_options)
            _LOGGER.info("Auto-config actuators saved to database")
        elif cat == "global" and key == "auto_config":
            coordinator.entry_data["auto_config"] = value
            if value is True:
                for cat_key in HAZARD_CATEGORIES:
                    if cat_key in coordinator.category_config:
                        coordinator.category_config[cat_key]["sensors"] = []
                        coordinator.category_config[cat_key]["actuators"] = []
                coordinator.category_config = perform_auto_discovery(
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

    # === SERWIS: TEST ALARMU (wywoływany z frontendu) ===
    async def _test_alert_service(call) -> None:
        """Handle test alert service calls from the frontend."""
        cat = call.data.get("category")
        execute_actions = call.data.get("execute_actions", False)

        if not cat:
            _LOGGER.error("[service test_alert] Missing 'category' parameter")
            return

        _LOGGER.info(
            "[service test_alert] cat=%s, execute_actions=%s", cat, execute_actions
        )

        dummy_entity = f"binary_sensor.test_{cat}"
        await coordinator.trigger_alert(
            dummy_entity,
            is_test=True,
            test_action=execute_actions,
            force_cat=cat,
        )

    hass.services.async_register(DOMAIN, "test_alert", _test_alert_service)

    # === SERWIS: DISMISS ALARMU (wywoływany z frontendu) ===
    async def _dismiss_alert_service(call) -> None:
        """Handle dismiss alert service calls from the frontend."""
        cat = call.data.get("category")

        if not cat:
            _LOGGER.error("[service dismiss_alert] Missing 'category' parameter")
            return

        _LOGGER.info("[service dismiss_alert] cat=%s", cat)
        await coordinator.dismiss_alert(cat)

    hass.services.async_register(DOMAIN, "dismiss_alert", _dismiss_alert_service)
    # ====================================================

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
    hass.services.async_remove(DOMAIN, "test_alert")
    hass.services.async_remove(DOMAIN, "dismiss_alert")

    return unload_ok
