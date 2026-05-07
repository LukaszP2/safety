from __future__ import annotations
from typing import Any
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from .const import DOMAIN

async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Zwraca dane diagnostyczne dla wpisu konfiguracji."""
    coordinator = hass.data[DOMAIN][entry.entry_id]
    
    return {
        "entry": {
            "title": entry.title,
            "data": dict(entry.data),
            "options": dict(entry.options),
        },
        "engine_state": coordinator.engine.states.get(entry.data.get("name"), {}),
        "all_engine_states": coordinator.engine.states
    }
