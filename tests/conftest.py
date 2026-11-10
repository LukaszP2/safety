"""Test configuration and stubs for Home Assistant."""

from __future__ import annotations

import sys
import types
from unittest.mock import MagicMock


def _setup_ha_stubs():
    if "voluptuous" not in sys.modules:
        vol = types.ModuleType("voluptuous")
        vol.Schema = MagicMock(side_effect=lambda x: x)
        vol.Required = MagicMock(side_effect=lambda x: x)
        vol.Optional = MagicMock(side_effect=lambda x, default=None: x)
        vol.Any = MagicMock(side_effect=lambda *args: args[0] if args else None)
        sys.modules["voluptuous"] = vol

    if "homeassistant" in sys.modules:
        return

    ha = types.ModuleType("homeassistant")
    sys.modules["homeassistant"] = ha

    # homeassistant.const
    const = types.ModuleType("homeassistant.const")
    const.STATE_UNAVAILABLE = "unavailable"
    const.STATE_UNKNOWN = "unknown"
    sys.modules["homeassistant.const"] = const
    ha.const = const

    # homeassistant.config_entries
    ce = types.ModuleType("homeassistant.config_entries")

    class ConfigEntry(MagicMock):
        __class_getitem__ = classmethod(lambda cls, item: cls)

    class ConfigFlow:
        def __init_subclass__(cls, domain=None, **kwargs):
            super().__init_subclass__(**kwargs)
            cls._domain = domain

        def __init__(self):
            self.unique_id = None
            self.hass = MagicMock()

        async def async_set_unique_id(self, uid):
            self.unique_id = uid

        def _abort_if_unique_id_configured(self):
            pass

        def async_show_form(self, step_id, data_schema=None, errors=None):
            return {
                "type": "form",
                "step_id": step_id,
                "data_schema": data_schema,
                "errors": errors or {},
            }

        def async_create_entry(self, title, data):
            return {"type": "create_entry", "title": title, "data": data}

        def async_abort(self, reason):
            return {"type": "abort", "reason": reason}

    class OptionsFlow:
        def __init__(self, config_entry=None):
            self._config_entry = config_entry

        @property
        def config_entry(self):
            return self._config_entry

        def async_show_form(self, step_id, data_schema=None, errors=None):
            return {
                "type": "form",
                "step_id": step_id,
                "data_schema": data_schema,
                "errors": errors or {},
            }

        def async_create_entry(self, title, data):
            return {"type": "create_entry", "title": title, "data": data}

    ce.ConfigEntry = ConfigEntry
    ce.ConfigFlow = ConfigFlow
    ce.OptionsFlow = OptionsFlow
    sys.modules["homeassistant.config_entries"] = ce
    ha.config_entries = ce

    # homeassistant.core
    core = types.ModuleType("homeassistant.core")

    class HomeAssistant(MagicMock):
        pass

    def callback(fn):
        return fn

    core.HomeAssistant = HomeAssistant
    core.callback = callback
    sys.modules["homeassistant.core"] = core
    ha.core = core

    # homeassistant.exceptions
    exc = types.ModuleType("homeassistant.exceptions")

    class HomeAssistantError(Exception):
        pass

    exc.HomeAssistantError = HomeAssistantError
    sys.modules["homeassistant.exceptions"] = exc
    ha.exceptions = exc

    # homeassistant.helpers
    helpers = types.ModuleType("homeassistant.helpers")

    dr = types.ModuleType("homeassistant.helpers.device_registry")

    class DeviceInfo(dict):
        def __init__(self, **kwargs):
            super().__init__(**kwargs)

    dr.DeviceInfo = DeviceInfo
    dr.async_get = MagicMock()
    sys.modules["homeassistant.helpers.device_registry"] = dr
    helpers.device_registry = dr

    er = types.ModuleType("homeassistant.helpers.entity_registry")
    er.async_get = MagicMock()
    sys.modules["homeassistant.helpers.entity_registry"] = er
    helpers.entity_registry = er

    event = types.ModuleType("homeassistant.helpers.event")
    event.async_track_time_interval = MagicMock(return_value=MagicMock())
    event.async_track_state_change_event = MagicMock(return_value=MagicMock())
    sys.modules["homeassistant.helpers.event"] = event
    helpers.event = event

    entity = types.ModuleType("homeassistant.helpers.entity")

    class EntityCategory:
        CONFIG = "config"
        DIAGNOSTIC = "diagnostic"

    entity.EntityCategory = EntityCategory
    sys.modules["homeassistant.helpers.entity"] = entity
    helpers.entity = entity

    entity_platform = types.ModuleType("homeassistant.helpers.entity_platform")
    entity_platform.AddEntitiesCallback = MagicMock()
    sys.modules["homeassistant.helpers.entity_platform"] = entity_platform
    helpers.entity_platform = entity_platform

    sys.modules["homeassistant.helpers"] = helpers
    ha.helpers = helpers

    # homeassistant.components
    components = types.ModuleType("homeassistant.components")
    components.__path__ = []

    http = types.ModuleType("homeassistant.components.http")

    class StaticPathConfig:
        def __init__(self, *args, **kwargs):
            pass

    http.StaticPathConfig = StaticPathConfig
    sys.modules["homeassistant.components.http"] = http
    components.http = http

    sensor = types.ModuleType("homeassistant.components.sensor")

    class SensorEntity:
        def __init__(self):
            self._attr_native_value = None
            self._attr_extra_state_attributes = {}

        @property
        def extra_state_attributes(self):
            return self._attr_extra_state_attributes

        def async_write_ha_state(self):
            pass

    sensor.SensorEntity = SensorEntity
    sys.modules["homeassistant.components.sensor"] = sensor
    components.sensor = sensor

    switch = types.ModuleType("homeassistant.components.switch")

    class SwitchEntity:
        def __init__(self):
            self._attr_is_on = False

        def async_write_ha_state(self):
            pass

    switch.SwitchEntity = SwitchEntity
    sys.modules["homeassistant.components.switch"] = switch
    components.switch = switch

    button = types.ModuleType("homeassistant.components.button")

    class ButtonEntity:
        pass

    button.ButtonEntity = ButtonEntity
    sys.modules["homeassistant.components.button"] = button
    components.button = button

    number = types.ModuleType("homeassistant.components.number")

    class NumberEntity:
        def __init__(self):
            self._attr_native_value = 0.0

        def async_write_ha_state(self):
            pass

    number.NumberEntity = NumberEntity
    sys.modules["homeassistant.components.number"] = number
    components.number = number

    text = types.ModuleType("homeassistant.components.text")

    class TextEntity:
        def __init__(self):
            self._attr_native_value = ""

        def async_write_ha_state(self):
            pass

    text.TextEntity = TextEntity
    sys.modules["homeassistant.components.text"] = text
    components.text = text

    frontend = types.ModuleType("homeassistant.components.frontend")
    frontend.async_register_built_in_panel = MagicMock()
    frontend.async_remove_panel = MagicMock()
    sys.modules["homeassistant.components.frontend"] = frontend
    components.frontend = frontend

    websocket_api = types.ModuleType("homeassistant.components.websocket_api")

    class ActiveConnection(MagicMock):
        pass

    def websocket_command(schema):
        def decorator(func):
            func._ws_schema = schema
            return func
        return decorator

    def async_response(func):
        return func

    websocket_api.ActiveConnection = ActiveConnection
    websocket_api.websocket_command = websocket_command
    websocket_api.async_response = async_response
    websocket_api.async_register_command = MagicMock()
    websocket_api.ERR_NOT_FOUND = "not_found"

    sys.modules["homeassistant.components.websocket_api"] = websocket_api
    components.websocket_api = websocket_api

    sys.modules["homeassistant.components"] = components
    ha.components = components

    # homeassistant.util.dt
    dt = types.ModuleType("homeassistant.util.dt")
    import datetime
    dt.now = datetime.datetime.now
    dt.utcnow = datetime.datetime.utcnow
    sys.modules["homeassistant.util"] = types.ModuleType("homeassistant.util")
    sys.modules["homeassistant.util.dt"] = dt
    ha.util = sys.modules["homeassistant.util"]
    ha.util.dt = dt


_setup_ha_stubs()
