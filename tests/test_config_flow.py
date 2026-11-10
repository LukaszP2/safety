"""Tests for Safety Hub config flow and options flow."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest

from custom_components.safety.config_flow import SafetyConfigFlow, SafetyOptionsFlow
from custom_components.safety.const import DOMAIN


@pytest.mark.asyncio
async def test_config_flow_user_step_initial():
    """Test initial form display in user step."""
    flow = SafetyConfigFlow()
    result = await flow.async_step_user()
    assert result["type"] == "form"
    assert result["step_id"] == "user"


@pytest.mark.asyncio
async def test_config_flow_user_step_submit():
    """Test user step submission creates entry."""
    flow = SafetyConfigFlow()
    flow.hass = MagicMock()
    flow.hass.data = {DOMAIN: {"title": "Safety Hub"}}
    result = await flow.async_step_user({"auto_config": True})
    assert result["type"] == "create_entry"
    assert result["data"] == {"auto_config": True}


@pytest.mark.asyncio
async def test_options_flow_preserves_categories():
    """Test AUD-001 fix: OptionsFlow must merge with existing options and not wipe categories."""
    mock_entry = MagicMock()
    mock_entry.options = {
        "auto_config": True,
        "initialized": True,
        "categories": {
            "water": {"sensors": ["binary_sensor.water_1"], "actuators": ["valve.water"]},
            "global": {"push_dnd": True},
        },
    }
    mock_entry.data = {}

    options_flow = SafetyOptionsFlow(mock_entry)

    # Initial step without input shows form
    form_result = await options_flow.async_step_init()
    assert form_result["type"] == "form"
    assert form_result["step_id"] == "init"

    # Submit input to change options including speakers and persistent notification
    user_input = {
        "phone_notify": "notify.mobile_phone",
        "speakers": "media_player.living_room",
        "use_persistent_notification": True,
        "water_valve": "valve.main_shutoff",
        "use_test_mode": False,
    }
    result = await options_flow.async_step_init(user_input)

    assert result["type"] == "create_entry"
    # Ensure options are added, AND existing categories/initialized are preserved
    saved_data = result["data"]
    assert saved_data["phone_notify"] == "notify.mobile_phone"
    assert saved_data["speakers"] == "media_player.living_room"
    assert saved_data["use_persistent_notification"] is True
    assert saved_data["water_valve"] == "valve.main_shutoff"
    assert saved_data["use_test_mode"] is False
    assert "categories" in saved_data
    assert saved_data["categories"]["water"]["actuators"] == ["valve.water"]
    assert saved_data["initialized"] is True
