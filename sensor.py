"""Sensor platform for Safety integration."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.device_registry import DeviceInfo

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up sensor entry.

    Args:
        hass: Home Assistant instance
        entry: Config entry
        async_add_entities: Callback to add entities
    """
    coordinator = hass.data[DOMAIN][entry.entry_id]
    sensor = HazardStatusSensor(coordinator, entry.entry_id)
    coordinator.sensor = sensor
    async_add_entities([sensor])


class HazardStatusSensor(SensorEntity):
    """Sensor for monitoring hazard status."""

    _attr_has_entity_name = True
    _attr_translation_key = "safety_status"
    _attr_native_value: str = "safe"

    def __init__(self, coordinator: Any, entry_id: str) -> None:
        """Initialize the sensor.

        Args:
            coordinator: The coordinator
            entry_id: Config entry ID
        """
        self.coordinator = coordinator
        self._entry_id = entry_id
        self._attr_unique_id = f"{entry_id}_status"

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry_id)},
            name="Safety: Central Hub",
            manufacturer="Safety Systems",
            model="Main Controller",
        )

        self._attr_extra_state_attributes: dict[str, Any] = {"unique_key": "status"}

    async def async_added_to_hass(self) -> None:
        """Called when entity is added to Home Assistant."""
        await super().async_added_to_hass()
        self.update_internal_state()

    @callback
    def update_internal_state(self) -> None:
        """Update internal state based on coordinator state."""
        if self.coordinator.active_hazards:
            self._attr_native_value = "alarm"
            self._attr_icon = "mdi:shield-alert"
        elif getattr(self.coordinator, "global_service_mode", False):
            self._attr_native_value = "service_mode"
            self._attr_icon = "mdi:shield-off"
        else:
            self._attr_native_value = "safe"
            self._attr_icon = "mdi:shield-check"

        self._attr_extra_state_attributes = {
            "unique_key": "status",
            "category_config": self.coordinator.category_config,
            "auto_config": self.coordinator.entry_data.get("auto_config", True),
            "active_alerts": list(self.coordinator.active_hazards.keys()),
            "service_mode": getattr(self.coordinator, "global_service_mode", False)
        }

        # Write state if entity is registered
        if getattr(self, "hass", None):
            self.async_write_ha_state()
