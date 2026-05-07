"""Button platform for Safety integration."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.button import ButtonEntity
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
    """Set up button entry.

    Args:
        hass: Home Assistant instance
        entry: Config entry
        async_add_entities: Callback to add entities
    """
    coordinator = hass.data[DOMAIN][entry.entry_id]
    buttons = []

    for cat in HAZARD_CATEGORIES:
        buttons.append(TestButton(coordinator, entry.entry_id, cat, False))
        buttons.append(TestButton(coordinator, entry.entry_id, cat, True))
        buttons.append(DismissButton(coordinator, entry.entry_id, cat))

    async_add_entities(buttons)


class TestButton(ButtonEntity):
    """Button to trigger test alerts."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(
        self,
        coordinator: Any,
        entry_id: str,
        category: str,
        with_action: bool,
    ) -> None:
        """Initialize the button.

        Args:
            coordinator: The coordinator
            entry_id: Config entry ID
            category: Hazard category
            with_action: Whether to include action execution
        """
        self.coordinator = coordinator
        self.category = category
        self.with_action = with_action
        self._entry_id = entry_id

        action_str = "action" if with_action else "notify"
        self._attr_unique_id = (
            f"{entry_id}_{category}_test_{action_str}"
        )
        self._attr_translation_key = f"test_{action_str}"
        self._attr_icon = (
            "mdi:alert-decagram"
            if with_action
            else "mdi:bell-ring"
        )

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"{entry_id}_{category}")},
            name=f"Module: {category.capitalize()}",
            manufacturer="Safety Systems",
            via_device=(DOMAIN, entry_id),
        )

    async def async_press(self) -> None:
        """Handle button press."""
        dummy_entity = f"binary_sensor.test_{self.category}"
        await self.coordinator.trigger_alert(
            dummy_entity,
            is_test=True,
            test_action=self.with_action,
            force_cat=self.category,
        )


class DismissButton(ButtonEntity):
    """Button to dismiss alerts."""

    _attr_has_entity_name = True
    _attr_translation_key = "dismiss_alarm"
    _attr_icon = "mdi:check-circle"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(
        self,
        coordinator: Any,
        entry_id: str,
        category: str,
    ) -> None:
        """Initialize the button.

        Args:
            coordinator: The coordinator
            entry_id: Config entry ID
            category: Hazard category
        """
        self.coordinator = coordinator
        self.category = category
        self._entry_id = entry_id
        self._attr_unique_id = f"{entry_id}_{category}_dismiss"

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"{entry_id}_{category}")},
            name=f"Module: {category.capitalize()}",
            manufacturer="Safety Systems",
            via_device=(DOMAIN, entry_id),
        )

    async def async_press(self) -> None:
        """Handle button press."""
        await self.coordinator.dismiss_alert(self.category)
