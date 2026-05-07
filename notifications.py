# /config/custom_components/Safety/notifications.py
import logging
from homeassistant.core import HomeAssistant
from .const import CONF_NOTIFY_SERVICE

_LOGGER = logging.getLogger(__name__)

class NotificationDispatcher:
    def __init__(self, hass: HomeAssistant, config: dict):
        self.hass = hass
        self.notify_service = config.get(CONF_NOTIFY_SERVICE)

        # Zabezpieczenie na wypadek wybrania jednego głośnika
        spk = config.get("speakers", [])
        self.speakers = [spk] if isinstance(spk, str) else (spk or [])

    async def send_to_ha(self, title: str, message: str):
        await self.hass.services.async_call(
            "persistent_notification", "create",
            {"title": title, "message": message, "notification_id": "safety_alarm"}
        )

    async def send_to_mobile(self, title: str, message: str):
        if self.notify_service:
            service = self.notify_service.split(".")[1] if "." in self.notify_service else self.notify_service
            await self.hass.services.async_call("notify", service, {"title": title, "message": message})

    async def send_to_tts(self, message: str):
        if self.speakers:
            for speaker in self.speakers:
                await self.hass.services.async_call("media_player", "volume_set", {"entity_id": speaker, "volume_level": 1.0})
                await self.hass.services.async_call("tts", "speak", {"media_player_entity_id": speaker, "message": f"Uwaga! {message}"})
