"""Auto-discovery logic for Safety integration."""

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

_LOGGER = logging.getLogger(__name__)


def perform_auto_discovery(
    hass: HomeAssistant, current_cats: dict[str, Any] | None = None
) -> dict[str, Any]:
    """Auto-discover hazard sensors and actuators in the system."""
    _LOGGER.debug("Rozpoczynam skanowanie Auto-Discovery dla Safety...")

    cat_cfg = current_cats or {}
    expected_cats = ["water", "fire", "gas", "temperature", "power"]

    for cat in expected_cats:
        if cat not in cat_cfg:
            cat_cfg[cat] = {}
        for key in [
            "sensors", "actuators", "actions", "notify_push",
            "notify_tts", "notify_lights", "notify_sirens", "predictions",
        ]:
            if key not in cat_cfg[cat] or not isinstance(cat_cfg[cat][key], list):
                cat_cfg[cat][key] = []
        if "custom_msg" not in cat_cfg[cat]:
            cat_cfg[cat]["custom_msg"] = ""

    if "global" not in cat_cfg:
        cat_cfg["global"] = {}

    states = hass.states.async_all()
    all_push = [s.entity_id for s in states if s.domain == "notify" and "mobile" in s.entity_id]
    all_tts = [s.entity_id for s in states if s.domain == "media_player"]
    all_lights = [s.entity_id for s in states if s.domain == "light"]

    sel_push = [all_push[0]] if len(all_push) == 1 else []
    sel_tts = [all_tts[0]] if len(all_tts) == 1 else []
    sel_lights = [all_lights[0]] if len(all_lights) == 1 else []

    default_matrix = {
        "home": {"actions": True, "notify_ha": True, "notify_push": True, "notify_tts": True, "notify_sirens": False, "notify_lights": True, "notify_scripts": True},
        "away": {"actions": True, "notify_ha": False, "notify_push": True, "notify_tts": False, "notify_sirens": True, "notify_lights": False, "notify_scripts": True},
        "vacation": {"actions": True, "notify_ha": False, "notify_push": True, "notify_tts": False, "notify_sirens": True, "notify_lights": False, "notify_scripts": False},
        "night": {"actions": True, "notify_ha": False, "notify_push": True, "notify_tts": False, "notify_sirens": True, "notify_lights": True, "notify_scripts": True},
        "prediction": {"actions": True, "notify_ha": False, "notify_push": True, "notify_tts": True, "notify_sirens": False, "notify_lights": False, "notify_scripts": True},
    }

    default_global = {
        "use_predictions": True, "use_home_modes": False,
        "home_mode_type": "custom", "geolocation": False, "use_night_mode": False,
        "night_start": "22:00", "night_end": "07:00", "global_home_modes": False,
        "global_mode_matrix": default_matrix, "use_default_notifications": False,
        "notify_ha": True, "notify_push": sel_push, "push_dnd": True,
        "notify_tts": sel_tts, "tts_volume": 50, "tts_repeat": True,
        "tts_repeat_interval": 5, "notify_sirens": [],
        "notify_lights": sel_lights, "light_effect": True, "notify_scripts": [],
        "scripts_skip_conditions": True, "use_custom_messages": False,
        "default_title": "ZAGROŻENIE",
        "default_msg": "{{time}}: {{sensor_name}} ({{sensor_area}}) -> {{device_name}}",
    }

    for k, v in default_global.items():
        if k not in cat_cfg["global"] or current_cats is None:
            cat_cfg["global"][k] = v

    if current_cats is None:
        cat_cfg["global"].update(default_global)

    ent_reg = er.async_get(hass)
    for state in states:
        domain, entity_id = state.domain, state.entity_id
        if domain in ("switch", "valve", "water_heater", "cover", "button"):
            comb = f"{entity_id} {str(state.attributes.get('friendly_name', ''))}".lower()
            if any(w in comb for w in ["water", "woda", "zawor", "valve"]):
                if entity_id not in cat_cfg["water"]["actuators"]:
                    cat_cfg["water"]["actuators"].append(entity_id)
            if any(w in comb for w in ["gas", "gaz"]):
                if entity_id not in cat_cfg["gas"]["actuators"]:
                    cat_cfg["gas"]["actuators"].append(entity_id)
            if any(w in comb for w in ["power", "zasil", "socket", "gniazd"]):
                if entity_id not in cat_cfg["power"]["actuators"]:
                    cat_cfg["power"]["actuators"].append(entity_id)
        if domain in ("binary_sensor", "sensor"):
            dcl = state.attributes.get("device_class")
            if not dcl:
                entry = ent_reg.async_get(entity_id)
                dcl = entry.device_class or entry.original_device_class if entry else None
            if dcl in ("moisture", "water", "leak", "flood"):
                if entity_id not in cat_cfg["water"]["sensors"]:
                    cat_cfg["water"]["sensors"].append(entity_id)
            elif dcl in ("smoke", "fire", "heat"):
                if entity_id not in cat_cfg["fire"]["sensors"]:
                    cat_cfg["fire"]["sensors"].append(entity_id)
            elif dcl in ("gas", "volatile_organic_compounds"):
                if entity_id not in cat_cfg["gas"]["sensors"]:
                    cat_cfg["gas"]["sensors"].append(entity_id)
            elif dcl == "temperature":
                if entity_id not in cat_cfg["temperature"]["sensors"]:
                    cat_cfg["temperature"]["sensors"].append(entity_id)
            elif dcl in ("power", "energy", "current", "voltage"):
                if entity_id not in cat_cfg["power"]["sensors"]:
                    cat_cfg["power"]["sensors"].append(entity_id)

    return cat_cfg