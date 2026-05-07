"""Text platform for Safety integration."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.text import TextEntity
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
    """Set up text entry.

    Args:
        hass: Home Assistant instance
        entry: Config entry
        async_add_entities: Callback to add entities
    """
    coordinator = hass.data[DOMAIN][entry.entry_id]
    texts = [
        CustomMessageText(coordinator, entry.entry_id, cat)
        for cat in HAZARD_CATEGORIES
    ]
    async_add_entities(texts)


class CustomMessageText(TextEntity):
    """Text entity for custom alert messages."""

    _attr_has_entity_name = True
    _attr_translation_key = "custom_msg"
    _attr_icon = "mdi:message-alert-outline"
    _attr_native_value = ""
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(
        self,
        coordinator: Any,
        entry_id: str,
        category: str,
    ) -> None:
        """Initialize the text entity.

        Args:
            coordinator: The coordinator
            entry_id: Config entry ID
            category: Hazard category
        """
        self.coordinator = coordinator
        self.category = category
        self._entry_id = entry_id
        self._attr_unique_id = f"{entry_id}_{category}_custom_msg"
        self._attr_native_value = ""

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"{entry_id}_{category}")},
            name=f"Module: {category.capitalize()}",
            manufacturer="Safety Systems",
            via_device=(DOMAIN, entry_id),
        )

    async def async_set_value(self, value: str) -> None:
        """Set the text value.

        Args:
            value: The new value
        """
        self._attr_native_value = value

        if not hasattr(self.coordinator, "custom_messages"):
            self.coordinator.custom_messages = {}

        self.coordinator.custom_messages[self.category] = value
        self.async_write_ha_state()
