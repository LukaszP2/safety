"""Tests for device registration and entity persistence."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest

from custom_components.safety import ws_get_config
from custom_components.safety.button import DismissButton, TestButton
from custom_components.safety.const import DOMAIN
from custom_components.safety.number import RepeatIntervalNumber
from custom_components.safety.sensor import HazardStatusSensor
from custom_components.safety.switch import (
    CategoryServiceSwitch,
    GlobalServiceSwitch,
    HazardChannelSwitch,
)
from custom_components.safety.text import CustomMessageText


def test_global_service_switch_translation_key():
    """Test AUD-012 fix: GlobalServiceSwitch translation key matches strings.json."""
    coordinator = MagicMock()
    coordinator.global_service_mode = False
    switch = GlobalServiceSwitch(coordinator, "entry_123")
    assert switch._attr_translation_key == "global_service_mode"


def test_device_info_hierarchy_via_device():
    """Test AUD-009 fix: Category module entities specify via_device tuple."""
    coordinator = MagicMock()
    coordinator.service_mode = {}
    coordinator.channels = {}
    coordinator.repeat_interval = {}
    coordinator.category_config = {}

    entry_id = "entry_test_456"

    cat_switch = CategoryServiceSwitch(coordinator, entry_id, "water")
    assert cat_switch._attr_device_info.get("via_device") == (DOMAIN, entry_id)

    chan_switch = HazardChannelSwitch(coordinator, entry_id, "water", "mobile")
    assert chan_switch._attr_device_info.get("via_device") == (DOMAIN, entry_id)

    test_btn = TestButton(coordinator, entry_id, "fire", False)
    assert test_btn._attr_device_info.get("via_device") == (DOMAIN, entry_id)

    dismiss_btn = DismissButton(coordinator, entry_id, "fire")
    assert dismiss_btn._attr_device_info.get("via_device") == (DOMAIN, entry_id)

    repeat_num = RepeatIntervalNumber(coordinator, entry_id, "gas")
    assert repeat_num._attr_device_info.get("via_device") == (DOMAIN, entry_id)

    msg_text = CustomMessageText(coordinator, entry_id, "gas")
    assert msg_text._attr_device_info.get("via_device") == (DOMAIN, entry_id)


@pytest.mark.asyncio
async def test_number_entity_persists_options():
    """Test AUD-007 fix: Setting number value persists to config entry options."""
    coordinator = MagicMock()
    coordinator.repeat_interval = {}
    coordinator.category_config = {"water": {}}
    mock_entry = MagicMock()
    mock_entry.options = {"categories": coordinator.category_config}
    coordinator.hass.config_entries.async_get_entry.return_value = mock_entry

    number = RepeatIntervalNumber(coordinator, "entry_1", "water")
    await number.async_set_native_value(15.0)

    assert coordinator.repeat_interval["water"] == 15
    coordinator.hass.config_entries.async_update_entry.assert_called_once()
    saved_opts = coordinator.hass.config_entries.async_update_entry.call_args[1]["options"]
    assert saved_opts["categories"]["water"]["repeat_interval"] == 15


@pytest.mark.asyncio
async def test_text_entity_persists_options():
    """Test AUD-007 fix: Setting custom text persists to config entry options."""
    coordinator = MagicMock()
    coordinator.custom_messages = {}
    coordinator.category_config = {"fire": {}}
    mock_entry = MagicMock()
    mock_entry.options = {"categories": coordinator.category_config}
    coordinator.hass.config_entries.async_get_entry.return_value = mock_entry

    text = CustomMessageText(coordinator, "entry_1", "fire")
    await text.async_set_value("Evacuate now!")

    assert coordinator.custom_messages["fire"] == "Evacuate now!"
    coordinator.hass.config_entries.async_update_entry.assert_called_once()
    saved_opts = coordinator.hass.config_entries.async_update_entry.call_args[1]["options"]
    assert saved_opts["categories"]["fire"]["custom_msg"] == "Evacuate now!"


def test_hazard_status_sensor_no_category_config_attribute():
    """Test PKG-01: HazardStatusSensor does not expose category_config in state attributes."""
    coordinator = MagicMock()
    coordinator.active_hazards = {}
    coordinator.global_service_mode = False
    coordinator.entry_data = {"auto_config": True}
    coordinator.category_config = {
        "water": {"sensors": ["binary_sensor.leak"], "actuators": []},
        "global": {"push_dnd": True},
    }

    sensor = HazardStatusSensor(coordinator, "test_entry")
    sensor.update_internal_state()

    attrs = sensor.extra_state_attributes
    assert "category_config" not in attrs
    assert attrs["unique_key"] == "status"
    assert attrs["auto_config"] is True
    assert attrs["active_alerts"] == []
    assert attrs["service_mode"] is False


def test_websocket_get_config():
    """Test PKG-01: WebSocket safety/config command returns coordinator.category_config."""
    hass = MagicMock()
    coordinator = MagicMock()
    coordinator.category_config = {
        "water": {"sensors": ["binary_sensor.leak"]},
        "global": {"push_dnd": True},
    }
    hass.data = {DOMAIN: {"entry_1": coordinator}}

    connection = MagicMock()
    msg = {"id": 42, "type": "safety/config"}

    ws_get_config(hass, connection, msg)

    connection.send_result.assert_called_once_with(42, coordinator.category_config)


def test_websocket_get_config_not_found():
    """Test PKG-01: WebSocket safety/config command handles missing coordinator."""
    hass = MagicMock()
    hass.data = {DOMAIN: {}}

    connection = MagicMock()
    msg = {"id": 99, "type": "safety/config"}

    ws_get_config(hass, connection, msg)

    connection.send_error.assert_called_once()
    assert connection.send_error.call_args[0][0] == 99
    assert connection.send_error.call_args[0][1] == "not_found"

