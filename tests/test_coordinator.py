"""Tests for SafetyCoordinator and actuator logic."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.safety.coordinator import SafetyCoordinator


@pytest.mark.asyncio
async def test_coordinator_actuator_service_mapping():
    """Test AUD-002 fix: correct services are called for valve, cover, button, siren, switch."""
    hass = MagicMock()
    hass.services = MagicMock()
    hass.services.async_call = AsyncMock()
    hass.states = MagicMock()
    hass.states.async_all = MagicMock(return_value=[])
    hass.states.get = MagicMock(return_value=None)
    hass.config = MagicMock()
    hass.config.language = "en"

    entry = MagicMock()
    entry.data = {}
    entry.options = {
        "categories": {
            "water": {
                "sensors": ["binary_sensor.water_leak"],
                "actuators": [
                    "valve.main_shutoff",
                    "cover.garage_door",
                    "button.reset_btn",
                    "switch.pump_power",
                    "siren.alarm_siren",
                    "lock.front_door",
                    "climate.hvac",
                ],
                "actions": [
                    "valve.drain_valve",
                    "script.safety_sequence",
                    "lock.emergency_exit",
                    "climate.exhaust",
                ],
                "notify_push": [],
                "notify_tts": [],
                "notify_lights": [],
                "notify_sirens": [],
            },
            "global": {},
        }
    }

    coordinator = SafetyCoordinator(hass, entry, prepared_options=entry.options)

    # Trigger alert for water category
    await coordinator.trigger_alert("binary_sensor.water_leak", force_cat="water")

    # Inspect all calls to async_call
    calls = hass.services.async_call.call_args_list
    call_signatures = [(call[0][0], call[0][1], call[0][2].get("entity_id")) for call in calls if len(call[0]) >= 3]

    # Verify valve closes, not turn_off!
    assert ("valve", "close_valve", "valve.main_shutoff") in call_signatures
    # Verify cover closes, not turn_off!
    assert ("cover", "close_cover", "cover.garage_door") in call_signatures
    # Verify button presses
    assert ("button", "press", "button.reset_btn") in call_signatures
    # Verify switch turns off
    assert ("switch", "turn_off", "switch.pump_power") in call_signatures
    # Verify siren turns on
    assert ("siren", "turn_on", "siren.alarm_siren") in call_signatures
    # Verify lock locks for actuator
    assert ("lock", "lock", "lock.front_door") in call_signatures
    # Verify climate turns off for actuator
    assert ("climate", "turn_off", "climate.hvac") in call_signatures
    # Verify action valve opens
    assert ("valve", "open_valve", "valve.drain_valve") in call_signatures
    # Verify action script is called
    assert ("script", "safety_sequence", "script.safety_sequence") in call_signatures
    # Verify action lock unlocks (emergency exit)
    assert ("lock", "unlock", "lock.emergency_exit") in call_signatures
    # Verify action climate turns off
    assert ("climate", "turn_off", "climate.exhaust") in call_signatures


@pytest.mark.asyncio
async def test_coordinator_dismiss_alert():
    """Test dismiss_alert clears active hazard and stops repeat loop."""
    hass = MagicMock()
    entry = MagicMock()
    coordinator = SafetyCoordinator(hass, entry, prepared_options={})

    coordinator.active_hazards["binary_sensor.water_leak"] = "water"
    mock_task = MagicMock()
    coordinator._repeat_tasks["water"] = mock_task

    await coordinator.dismiss_alert("water")

    assert "binary_sensor.water_leak" not in coordinator.active_hazards
    mock_task.cancel.assert_called_once()
    assert "water" not in coordinator._repeat_tasks


@pytest.mark.asyncio
async def test_coordinator_service_mode_suppression():
    """Test alerts are suppressed when global_service_mode is active."""
    hass = MagicMock()
    hass.services.async_call = AsyncMock()
    entry = MagicMock()
    coordinator = SafetyCoordinator(hass, entry, prepared_options={})
    coordinator.global_service_mode = True

    await coordinator.trigger_alert("binary_sensor.fire_alarm", force_cat="fire")

    # No hazards recorded and no service calls made
    assert len(coordinator.active_hazards) == 0
    hass.services.async_call.assert_not_called()


@pytest.mark.asyncio
async def test_coordinator_repeat_interval_guard():
    """Test AUD-04 fix: repeat interval is guarded against <= 0 values."""
    import asyncio
    hass = MagicMock()
    entry = MagicMock()
    coordinator = SafetyCoordinator(hass, entry, prepared_options={})
    coordinator.repeat_interval["water"] = -5
    coordinator.active_hazards["binary_sensor.water_leak"] = "water"

    # Start repeat loop with 0 interval (must be clamped to >= 1 minute, so sleep doesn't spin immediately)
    task = asyncio.create_task(
        coordinator._alert_repeat_loop(
            "water", "Title", "Msg", "binary_sensor.water_leak", {}, {"tts_repeat_interval": 0}, {}
        )
    )
    await asyncio.sleep(0.01)
    # Task should be waiting (sleeping 60s), not finished or crashed
    assert not task.done()
    task.cancel()
    await task
    assert task.done()


@pytest.mark.asyncio
async def test_coordinator_early_warning_prediction_alert():
    """Test T-06: prediction alerts use '🛡️ Wczesne Ostrzeżenie' terminology."""
    hass = MagicMock()
    hass.services = MagicMock()
    hass.services.async_call = AsyncMock()
    entry = MagicMock()
    coordinator = SafetyCoordinator(
        hass,
        entry,
        prepared_options={
            "categories": {
                "global": {"notify_push": ["notify.mobile_app_phone"]},
            }
        },
    )

    await coordinator._async_trigger_prediction_alert(
        "sensor.temperature", "freeze", "Ryzyko zamarzania (2.0°C)", "Sensor Temp"
    )

    hass.services.async_call.assert_called_once()
    domain, service, data = hass.services.async_call.call_args[0]
    assert domain == "notify"
    assert service == "mobile_app_phone"
    assert data["title"] == "🛡️ Wczesne Ostrzeżenie"
    assert data["message"].startswith("🛡️ Wczesne Ostrzeżenie:")

