"""Number platform for Safety integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.number import NumberEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, HAZARD_CATEGORIES

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up number entry."""
    coordinator = hass.data[DOMAIN][entry.entry_id]

    # Pobieramy rzeczywiste ID urządzenia hub z rejestru (wymagane przez via_device_id)
    device_reg = dr.async_get(hass)
    hub = device_reg.async_get_device(identifiers={(DOMAIN, entry.entry_id)})
    hub_device_id = hub.id if hub else None

    numbers = [
        RepeatIntervalNumber(coordinator, entry.entry_id, cat, hub_device_id)
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
        hub_device_id: str | None = None,
    ) -> None:
        """Initialize the number."""
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
            via_device_id=hub_device_id,
        )

    async def async_set_native_value(self, value: float) -> None:
        """Set the native value."""
        val = int(value)
        self.coordinator.repeat_interval[self.category] = val
        self._attr_native_value = value
        self.async_write_ha_state()
