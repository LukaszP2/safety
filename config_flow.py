"""Config flow for Safety integration."""
from __future__ import annotations

import logging
from typing import Any, Dict, Optional

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector
from homeassistant.exceptions import HomeAssistantError

from .const import (
    DOMAIN,
    CONF_NOTIFY_SERVICE,
    CONF_DEVICE_ID,
    ERROR_CANNOT_CONNECT,
    ERROR_INVALID_DEVICE,
    ERROR_UNKNOWN,
)

_LOGGER = logging.getLogger(__name__)


class CannotConnect(HomeAssistantError):
    """Error to indicate we cannot connect."""


class InvalidDevice(HomeAssistantError):
    """Error to indicate an invalid device."""


class SafetyConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Config flow for Safety integration."""

    VERSION = 1

    async def async_step_user(
        self, user_input: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Handle a flow initiated by the user.

        Args:
            user_input: User input data

        Returns:
            Flow step result
        """
        # Check if already configured on first call
        if self.unique_id is None:
            await self.async_set_unique_id(DOMAIN)

        # Abort if already configured
        self._abort_if_unique_id_configured()

        if user_input is not None:
            try:
                # Validate user input
                if CONF_DEVICE_ID in user_input:
                    await self._validate_device(user_input[CONF_DEVICE_ID])

                return self.async_create_entry(
                    title=self.hass.data.get(DOMAIN, {}).get("title", "Safety System"),
                    data=user_input
                )

            except CannotConnect:
                pass
            except InvalidDevice:
                pass
            except Exception as err:
                _LOGGER.exception("Unexpected exception: %s", err)

        data_schema = vol.Schema(
            {
                vol.Optional("auto_config", default=True): bool,
            }
        )

        return self.async_show_form(
            step_id="user",
            data_schema=data_schema,
        )



    async def async_step_reauth(
        self, entry_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Handle reauth flow.

        Args:
            entry_data: Config entry data

        Returns:
            Flow step result
        """
        _LOGGER.debug("Reauth triggered for Safety")
        return await self.async_step_user()

    async def _validate_device(self, device_id: str) -> bool:
        """Validate device ID.

        Args:
            device_id: Device ID to validate

        Returns:
            True if device is valid

        Raises:
            CannotConnect: If cannot connect to device
            InvalidDevice: If device is invalid
        """
        try:
            # Add device validation logic here
            # This is a placeholder for actual device validation
            if not device_id or not isinstance(device_id, str):
                raise InvalidDevice()
            return True
        except Exception as err:
            _LOGGER.error("Device validation failed: %s", err)
            raise CannotConnect() from err

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> "SafetyOptionsFlow":
        """Get the options flow for this config entry.

        Args:
            config_entry: Config entry instance

        Returns:
            Options flow instance
        """
        return SafetyOptionsFlow(config_entry)


class SafetyOptionsFlow(config_entries.OptionsFlow):
    """Handle options for Safety integration."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize the options flow.

        Args:
            config_entry: Config entry instance
        """
        self._config_entry = config_entry

    async def async_step_init(
        self, user_input: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Manage the options.

        Args:
            user_input: User input data

        Returns:
            Flow step result
        """
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        options = self._config_entry.options
        data = self._config_entry.data

        def get_val(key: str, default: Any = None) -> Any:
            """Get value from options or data.

            Args:
                key: Key to get
                default: Default value if not found

            Returns:
                Value from options, data, or default
            """
            return options.get(key, data.get(key, default))

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_NOTIFY_SERVICE,
                        default=get_val(CONF_NOTIFY_SERVICE, ""),
                    ): str,
                }
            ),
        )
