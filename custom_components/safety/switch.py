"""Switch platform for Safety integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CHANNELS, DOMAIN, HAZARD_CATEGORIES

_LOGGER = logging.getLogger(__name__)


async def _async_save_category_setting(
    coordinator: Any, entry_id: str, cat: str, key: str, value: Any
) -> None:
    """Save setting to category config and persist in entry options."""
    if cat not in coordinator.category_config:
        coordinator.category_config[cat] = {}
    coordinator.category_config[cat][key] = value
    entry = coordinator.hass.config_entries.async_get_entry(entry_id)
    if entry:
        new_options = dict(entry.options)
        new_options["categories"] = coordinator.category_config
        coordinator.hass.config_entries.async_update_entry(entry, options=new_options)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up switch entry."""
    coordinator = hass.data[DOMAIN][entry.entry_id]

    switches = [
        GlobalServiceSwitch(coordinator, entry.entry_id),
        GeolocationSwitch(coordinator, entry.entry_id),
        AutoConfigSwitch(coordinator, entry.entry_id),
    ]

    for cat in HAZARD_CATEGORIES:
        switches.append(
            CategoryServiceSwitch(coordinator, entry.entry_id, cat)
        )
        for ch in CHANNELS:
            switches.append(
                HazardChannelSwitch(coordinator, entry.entry_id, cat, ch)
            )

    async_add_entities(switches)


class GlobalServiceSwitch(SwitchEntity):
    """Switch for global service mode."""

    _attr_has_entity_name = True
    _attr_translation_key = "global_service_mode"
    _attr_icon = "mdi:shield-off"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, coordinator: Any, entry_id: str) -> None:
        """Initialize the switch.

        Args:
            coordinator: The coordinator
            entry_id: Config entry ID
        """
        self.coordinator = coordinator
        self._attr_unique_id = f"{entry_id}_global_service"
        self._attr_is_on = self.coordinator.global_service_mode
        self._entry_id = entry_id
        self._attr_extra_state_attributes = {"unique_key": "global_service"}

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, self._entry_id)},
            name="Safety: Central Hub",
            manufacturer="Safety Systems",
            model="Main Controller",
        )

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the switch on."""
        self.coordinator.global_service_mode = True
        self._attr_is_on = True
        self.async_write_ha_state()
        if self.coordinator.sensor:
            self.coordinator.sensor.update_internal_state()
        await _async_save_category_setting(
            self.coordinator, self._entry_id, "global", "global_service_mode", True
        )

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the switch off."""
        self.coordinator.global_service_mode = False
        self._attr_is_on = False
        self.async_write_ha_state()
        if self.coordinator.sensor:
            self.coordinator.sensor.update_internal_state()
        await _async_save_category_setting(
            self.coordinator, self._entry_id, "global", "global_service_mode", False
        )


class GeolocationSwitch(SwitchEntity):
    """Switch for geolocation-based alerts."""

    _attr_has_entity_name = True
    _attr_translation_key = "geolocation"
    _attr_icon = "mdi:shield-account-outline"

    def __init__(self, coordinator: Any, entry_id: str) -> None:
        """Initialize the switch.

        Args:
            coordinator: The coordinator
            entry_id: Config entry ID
        """
        self.coordinator = coordinator
        self._attr_unique_id = f"{entry_id}_geolocation"
        self._attr_is_on = self.coordinator.use_geolocation
        self._entry_id = entry_id
        self._attr_extra_state_attributes = {"unique_key": "geolocation"}

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, self._entry_id)},
            name="Safety: Central Hub",
            manufacturer="Safety Systems",
        )

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the switch on."""
        self.coordinator.use_geolocation = True
        self._attr_is_on = True
        self.async_write_ha_state()
        await _async_save_category_setting(
            self.coordinator, self._entry_id, "global", "geolocation", True
        )

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the switch off."""
        self.coordinator.use_geolocation = False
        self._attr_is_on = False
        self.async_write_ha_state()
        await _async_save_category_setting(
            self.coordinator, self._entry_id, "global", "geolocation", False
        )


class AutoConfigSwitch(SwitchEntity):
    """Switch for auto-configuration."""

    _attr_has_entity_name = True
    _attr_translation_key = "auto_config"
    _attr_icon = "mdi:shield-lock-outline"

    def __init__(self, coordinator: Any, entry_id: str) -> None:
        """Initialize the switch.

        Args:
            coordinator: The coordinator
            entry_id: Config entry ID
        """
        self.coordinator = coordinator
        self._attr_unique_id = f"{entry_id}_auto_config"
        self._attr_is_on = self.coordinator.entry_data.get("auto_config", True)
        self._entry_id = entry_id
        self._attr_extra_state_attributes = {"unique_key": "auto_config"}

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, self._entry_id)},
            name="Safety: Central Hub",
            manufacturer="Safety Systems",
        )

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the switch on."""
        await self.coordinator.hass.services.async_call(
            DOMAIN,
            "update_settings",
            {
                "category": "global",
                "key": "auto_config",
                "value": True,
            },
        )
        self._attr_is_on = True
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the switch off."""
        await self.coordinator.hass.services.async_call(
            DOMAIN,
            "update_settings",
            {
                "category": "global",
                "key": "auto_config",
                "value": False,
            },
        )
        self._attr_is_on = False
        self.async_write_ha_state()


class CategoryServiceSwitch(SwitchEntity):
    """Switch for category-level service mode."""

    _attr_has_entity_name = True
    _attr_translation_key = "category_service_mode"
    _attr_icon = "mdi:shield-alert-outline"

    def __init__(
        self,
        coordinator: Any,
        entry_id: str,
        category: str,
    ) -> None:
        """Initialize the switch."""
        self.coordinator = coordinator
        self.category = category
        self._entry_id = entry_id
        self._attr_unique_id = f"{entry_id}_{category}_service"
        self._attr_is_on = self.coordinator.service_mode.get(category, False)

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"{self._entry_id}_{self.category}")},
            name=f"Module: {self.category.capitalize()}",
            manufacturer="Safety Systems",
            via_device=(DOMAIN, self._entry_id),
        )

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the switch on."""
        self.coordinator.service_mode[self.category] = True
        self._attr_is_on = True
        self.async_write_ha_state()
        await _async_save_category_setting(
            self.coordinator, self._entry_id, self.category, "service_mode", True
        )

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the switch off."""
        self.coordinator.service_mode[self.category] = False
        self._attr_is_on = False
        self.async_write_ha_state()
        await _async_save_category_setting(
            self.coordinator, self._entry_id, self.category, "service_mode", False
        )


class HazardChannelSwitch(SwitchEntity):
    """Switch for notification channels."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: Any,
        entry_id: str,
        category: str,
        channel: str,
    ) -> None:
        """Initialize the switch."""
        self.coordinator = coordinator
        self.category = category
        self.channel = channel
        self._entry_id = entry_id

        self._attr_unique_id = f"{entry_id}_{category}_{channel}_notify"
        self._attr_translation_key = f"notify_{channel}"

        if channel == "mobile":
            self._attr_icon = "mdi:cellphone"
        elif channel == "tts":
            self._attr_icon = "mdi:speaker"
        elif channel == "light":
            self._attr_icon = "mdi:lightbulb-outline"
        else:
            self._attr_icon = "mdi:shield-check-outline"

        self._attr_is_on = self.coordinator.channels.get(self.category, {}).get(
            self.channel, True
        )

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"{self._entry_id}_{self.category}")},
            name=f"Module: {self.category.capitalize()}",
            manufacturer="Safety Systems",
            via_device=(DOMAIN, self._entry_id),
        )

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the switch on."""
        if self.category not in self.coordinator.channels:
            self.coordinator.channels[self.category] = {}
        self.coordinator.channels[self.category][self.channel] = True
        self._attr_is_on = True
        self.async_write_ha_state()
        key = "notify_lights_enabled" if self.channel == "light" else f"notify_{self.channel}"
        await _async_save_category_setting(
            self.coordinator, self._entry_id, self.category, key, True
        )

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the switch off."""
        if self.category not in self.coordinator.channels:
            self.coordinator.channels[self.category] = {}
        self.coordinator.channels[self.category][self.channel] = False
        self._attr_is_on = False
        self.async_write_ha_state()
        key = "notify_lights_enabled" if self.channel == "light" else f"notify_{self.channel}"
        await _async_save_category_setting(
            self.coordinator, self._entry_id, self.category, key, False
        )
