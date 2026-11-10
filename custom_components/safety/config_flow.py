"""Config flow for Safety integration."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback

from .const import (
    CONF_NOTIFY_SERVICE,
    CONF_USE_PERSISTENT_NOTIFICATION,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)


class SafetyConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):  # pyright: ignore[reportCallIssue, reportGeneralTypeIssues]  # type: ignore[call-arg]
    """Config flow for Safety integration."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        """Handle a flow initiated by the user."""
        if self.unique_id is None:
            await self.async_set_unique_id(DOMAIN)

        self._abort_if_unique_id_configured()

        if user_input is not None:
            return self.async_create_entry(
                title=self.hass.data.get(DOMAIN, {}).get("title", "Safety Hub"),
                data=user_input,
            )

        data_schema = vol.Schema(
            {
                vol.Optional("auto_config", default=True): bool,
            }
        )

        return self.async_show_form(
            step_id="user",
            data_schema=data_schema,
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> SafetyOptionsFlow:
        """Get the options flow for this config entry."""
        return SafetyOptionsFlow(config_entry)


class SafetyOptionsFlow(config_entries.OptionsFlow):
    """Handle options for Safety integration."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize the options flow."""
        self._config_entry = config_entry

    @property
    def config_entry(self) -> config_entries.ConfigEntry:
        """Return the config entry."""
        return getattr(self, "_config_entry", None) or super().config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        """Manage the options."""
        entry = self.config_entry
        if user_input is not None:
            current_options = dict(entry.options)
            new_options = {**current_options, **user_input}
            return self.async_create_entry(title="", data=new_options)

        options = entry.options
        data = entry.data

        def get_val(key: str, default: Any = None) -> Any:
            return options.get(key, data.get(key, default))

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_NOTIFY_SERVICE,
                        default=get_val(CONF_NOTIFY_SERVICE, ""),
                    ): str,
                    vol.Optional(
                        "speakers",
                        default=get_val("speakers", ""),
                    ): str,
                    vol.Optional(
                        CONF_USE_PERSISTENT_NOTIFICATION,
                        default=get_val(CONF_USE_PERSISTENT_NOTIFICATION, True),
                    ): bool,
                    vol.Optional(
                        "water_valve",
                        default=get_val("water_valve", ""),
                    ): str,
                    vol.Optional(
                        "use_test_mode",
                        default=get_val("use_test_mode", False),
                    ): bool,
                }
            ),
        )
