"""Safety integration - Home hazard detection and notifications."""

from __future__ import annotations

import copy
import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.frontend import (
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.event import async_track_state_change_event

from .const import DOMAIN, HAZARD_CATEGORIES
from .coordinator import SafetyCoordinator
from .discovery import perform_auto_discovery

_LOGGER = logging.getLogger(__name__)

PLATFORMS = ["sensor", "button", "switch", "number", "text"]


@websocket_api.websocket_command(
    {
        vol.Required("type"): "safety/config",
        vol.Optional("entry_id"): str,
    }
)
@callback
def ws_get_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Handle get safety configuration command."""
    entry_id = msg.get("entry_id")
    coordinators = hass.data.get(DOMAIN, {})
    if entry_id and entry_id in coordinators:
        coordinator = coordinators[entry_id]
    elif coordinators:
        coordinator = next(iter(coordinators.values()))
    else:
        coordinator = None

    if coordinator is None:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "Safety coordinator not found"
        )
        return

    connection.send_result(msg["id"], coordinator.category_config)


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

    except Exception as err:  # noqa: BLE001
        _LOGGER.error("Failed to setup coordinator: %s", err)
        return False

    websocket_api.async_register_command(hass, ws_get_config)

    try:
        panel_dir = hass.config.path("custom_components", DOMAIN, "www")
        if hasattr(hass, "http"):
            if hasattr(hass.http, "async_register_static_paths"):
                await hass.http.async_register_static_paths([
                    StaticPathConfig("/safety_static", panel_dir, cache_headers=False)
                ])
            elif hasattr(hass.http, "register_static_path"):
                hass.http.register_static_path("/safety_static", panel_dir, cache_headers=False)

        async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title="Safety",
            sidebar_icon="mdi:shield-check-outline",
            frontend_url_path="safety",
            config={
                "_panel_custom": {
                    "name": "safety-panel",
                    "module_url": "/safety_static/safety-panel.js",
                }
            },
            require_admin=True,
        )
    except Exception as err:  # noqa: BLE001
        _LOGGER.warning("Failed to register frontend panel: %s", err)

    unsub_track = None

    def setup_sensor_listeners():
        nonlocal unsub_track
        if unsub_track is not None:
            unsub_track()
            unsub_track = None

        sensors = set()
        for cat, cfg in coordinator.category_config.items():
            if cat != "global" and isinstance(cfg, dict):
                sensors.update(cfg.get("sensors", []))

        if sensors:
            @callback
            def _state_changed_listener(event) -> None:
                new_state = event.data.get("new_state")
                old_state = event.data.get("old_state")

                if not new_state or (old_state and old_state.state == new_state.state):
                    return

                if new_state.domain not in ("binary_sensor", "sensor"):
                    return

                if new_state.state in ["on", "True", "above"]:
                    for cat, cfg in coordinator.category_config.items():
                        if cat == "global" or not isinstance(cfg, dict):
                            continue
                        if new_state.entity_id in cfg.get("sensors", []):
                            hass.async_create_task(
                                coordinator.trigger_alert(new_state.entity_id, force_cat=cat)
                            )

            unsub_track = async_track_state_change_event(
                hass, list(sensors), _state_changed_listener
            )

    setup_sensor_listeners()
    entry.async_on_unload(lambda: unsub_track() if unsub_track else None)

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

        if key in ("sensors", "auto_config", "auto_config_sensors"):
            setup_sensor_listeners()

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

    update_settings_schema = vol.Schema(
        {
            vol.Required("category"): str,
            vol.Required("key"): str,
            vol.Required("value"): vol.Any(dict, list, str, int, float, bool, None),
        }
    )
    hass.services.async_register(
        DOMAIN, "update_settings", _update_settings_service, schema=update_settings_schema
    )

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
    except Exception as err:  # noqa: BLE001
        _LOGGER.error("Failed to set up platforms: %s", err)
        return False

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    coordinator.start_monitoring()

    _LOGGER.debug("Safety integration setup completed successfully")
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    coordinator = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if coordinator and "categories" in entry.options:
        coordinator.category_config = entry.options["categories"]
        if coordinator.sensor and hasattr(coordinator.sensor, "update_internal_state"):
            coordinator.sensor.update_internal_state()
            if hasattr(coordinator.sensor, "async_write_ha_state"):
                coordinator.sensor.async_write_ha_state()
    _LOGGER.debug("Safety configuration updated from entry options")


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
