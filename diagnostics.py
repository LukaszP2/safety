"""Diagnostics support for Safety Hub."""
from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN

TO_REDACT = {
    "api_key",
    "token",
    "password",
    "webhook_id",
    "unique_id",
    "latitude",
    "longitude",
    "address",
}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant,
    entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""

    # entry_data here is your SafetyCoordinator object
    coordinator = hass.data[DOMAIN].get(entry.entry_id)

    # Prepare integration state from coordinator attributes
    # We use getattr to avoid AttributeError if the property doesn't exist
    integration_state = {
        "global_service_mode": getattr(coordinator, "global_service_mode", False),
        "active_hazards_count": len(getattr(coordinator, "active_hazards", {})),
        "monitored_entities_count": len(getattr(coordinator, "category_config", {})),
    }

    diagnostics_data = {
        "entry": {
            "title": entry.title,
            "data": async_redact_data(dict(entry.data), TO_REDACT),
            "options": async_redact_data(dict(entry.options), TO_REDACT),
            "domain": entry.domain,
            "version": entry.version,
            "minor_version": entry.minor_version,
        },
        "integration_state": integration_state,
    }

    # If the coordinator stores data in the standard 'data' attribute, include it
    if coordinator and hasattr(coordinator, "data"):
        diagnostics_data["coordinator_data"] = async_redact_data(
            coordinator.data, TO_REDACT
        )

    return diagnostics_data
