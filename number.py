"""Number platform for Safety integration."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.number import NumberEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import EntityCategory

from .const import DOMAIN, HAZARD_CATEGORIES

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up number entry.

    Args:
        hass: Home Assistant instance
        entry: Config entry
        async_add_entities: Callback to add entities
    """
    coordinator = hass.data[DOMAIN][entry.entry_id]
    numbers = [
        RepeatIntervalNumber(coordinator, entry.entry_id, cat)
        for cat in HAZARD_CATEGORIES
    ]
    async_add_entities(numbers)


class RepeatIntervalNumber(NumberEntity):
    """Number entity for alert repeat interval."""

    _attr_has_entity_name = True
    _attr_translation_key = "repeat_interval"
    _attr_icon = "mdi:timer-sand"
    _attr_native_min_value = 1.0
    _attr_native_max_value = 60.0
    _attr_native_step = 1.0
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(
        self,
        coordinator: Any,
        entry_id: str,
        category: str,
    ) -> None:
        """Initialize the number.

        Args:
            coordinator: The coordinator
            entry_id: Config entry ID
            category: Hazard category
        """
        self.coordinator = coordinator
        self.category = category
        self._entry_id = entry_id
        self._attr_unique_id = f"{entry_id}_{category}_repeat"
        self._attr_native_value = float(
            self.coordinator.repeat_interval.get(category, 5)
        )

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"{entry_id}_{category}")},
            name=f"Module: {category.capitalize()}",
            manufacturer="Safety Systems",
            via_device=(DOMAIN, entry_id),
        )

    async def async_set_native_value(self, value: float) -> None:
        """Set the native value.

        Args:
            value: The new value
        """
        val = int(value)
        self.coordinator.repeat_interval[self.category] = val
        self._attr_native_value = value
        self.async_write_ha_state()
