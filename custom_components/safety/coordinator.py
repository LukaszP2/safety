"""Coordinator for Safety integration."""

from __future__ import annotations

import asyncio
import datetime
import logging
from datetime import timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.util import dt as dt_util

from .const import (
    ALARM_MESSAGES,
    CHANNELS,
    HAZARD_CATEGORIES,
    HAZARDS,
    REQUEST_TIMEOUT,
)

_LOGGER = logging.getLogger(__name__)


class SafetyCoordinator:
    """Coordinator for managing hazard detection and response."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        prepared_options: dict[str, Any] | None = None,
    ) -> None:
        """Initialize the coordinator."""
        self.hass = hass
        self.entry = entry

        # Mergowanie opcji
        if prepared_options is not None:
            merged = {**dict(entry.data), **prepared_options}
        else:
            merged = {**dict(entry.data), **dict(entry.options)}
        self.entry_data = merged

        self.use_geolocation = False
        self.global_service_mode = False
        self.sensor = None
        self.active_predictions: dict[str, str] = {}
        self._unsub_predictions = None

        self.active_hazards: dict[str, str] = {}
        self.service_mode: dict[str, bool] = {cat: False for cat in HAZARD_CATEGORIES}
        self.repeat_interval: dict[str, int] = {cat: 0 for cat in HAZARD_CATEGORIES}
        self.category_config: dict[str, Any] = self.entry_data.get("categories", {})
        self.custom_messages: dict[str, str] = {}
        self._repeat_tasks: dict[str, asyncio.Task] = {}
        self._failed_updates = 0
        self.last_update_success = True

        self.channels: dict[str, dict[str, bool]] = {}
        for cat in HAZARD_CATEGORIES:
            cfg = self.category_config.get(cat, {})
            self.channels[cat] = {}
            for ch in CHANNELS:
                if ch == "ha":
                    self.channels[cat][ch] = cfg.get("notify_ha", True)
                elif ch == "light":
                    self.channels[cat][ch] = cfg.get("notify_lights_enabled", True)
                else:
                    self.channels[cat][ch] = True

    def _get_category_info(self, entity_id: str) -> str:
        """Get hazard category based on entity device class."""
        state = self.hass.states.get(entity_id)
        device_class = state.attributes.get("device_class") if state else None

        for info in HAZARDS.values():
            if info["device_class"] == device_class:
                return info["cat"]

        return "other"

    def is_anyone_home(self) -> bool:
        """Check if anyone is home (geolocation check)."""
        if not self.use_geolocation:
            return True

        return any(p.state == "home" for p in self.hass.states.async_all("person"))

    def get_home_mode(self) -> str:
        """Evaluate current home mode (Home, Away, Night, Vacation)."""
        glob = self.category_config.get("global", {})
        if not glob.get("use_home_modes", False):
            return "home"

        now = dt_util.now().time()
        start_str = glob.get("night_start", "22:00")
        end_str = glob.get("night_end", "06:00")

        try:
            sh, sm = [int(p) for p in start_str.split(":", 1)]
            eh, em = [int(p) for p in end_str.split(":", 1)]
            start_t = datetime.time(sh, sm)
            end_t = datetime.time(eh, em)
            if start_t <= end_t:
                is_night = start_t <= now <= end_t
            else:
                is_night = now >= start_t or now <= end_t

            if is_night:
                return "night"
        except ValueError:
            pass

        if glob.get("home_mode_type") == "alarm":
            alarm_id = glob.get("alarm_entity")
            if alarm_id:
                state = self.hass.states.get(alarm_id)
                if state:
                    s = state.state
                    if s == "armed_away":
                        return "away"
                    if s == "armed_vacation":
                        return "vacation"
                    if s == "armed_night":
                        return "night"
                    return "home"

        if glob.get("home_mode_type") == "custom" and glob.get("geolocation", True):
            zone = self.hass.states.get("zone.home")
            if zone:
                persons = int(zone.state) if zone.state.isdigit() else 0
                return "home" if persons > 0 else "away"

        return "home"

    async def trigger_alert(
        self,
        entity_id: str,
        is_test: bool = False,
        test_action: bool = False,
        force_cat: str | None = None,
    ) -> None:
        """Trigger hazard alert with notifications and actions."""
        cat = force_cat if force_cat else self._get_category_info(entity_id)

        if self.global_service_mode or self.service_mode.get(cat, False):
            _LOGGER.debug(
                "Alert suppressed for %s - Service mode active (global=%s, category=%s)",
                entity_id,
                self.global_service_mode,
                self.service_mode.get(cat, False),
            )
            return

        if not is_test:
            self.active_hazards[entity_id] = cat
            if self.sensor:
                self.sensor.update_internal_state()

        cfg = self.category_config.get(cat, {})
        glob = self.category_config.get("global", {})

        current_mode = self.get_home_mode()
        _LOGGER.debug(
            "Safety Alert triggered. Current mapped Home Mode: %s", current_mode
        )

        # 1. Execute actuators and actions with timeout protection
        if not is_test or (is_test and test_action):
            actuators = cfg.get("actuators", [])
            for act in (
                actuators
                if isinstance(actuators, list)
                else [actuators]
                if actuators
                else []
            ):
                try:
                    domain = act.split(".")[0]
                    if domain in ["siren", "fan"]:
                        service = "turn_on"
                    elif domain == "valve":
                        service = "close_valve"
                    elif domain == "cover":
                        service = "close_cover"
                    elif domain == "lock":
                        service = "lock"
                    elif domain == "climate":
                        service = "turn_off"
                    elif domain == "button":
                        service = "press"
                    else:
                        service = "turn_off"

                    try:
                        await asyncio.wait_for(
                            self.hass.services.async_call(
                                domain, service, {"entity_id": act}
                            ),
                            timeout=REQUEST_TIMEOUT,
                        )
                    except TimeoutError:
                        _LOGGER.error("Timeout controlling actuator %s", act)
                except Exception as err:  # noqa: BLE001
                    _LOGGER.error("Error controlling actuator %s: %s", act, err)

            actions = cfg.get("actions", [])
            for act in (
                actions if isinstance(actions, list) else [actions] if actions else []
            ):
                try:
                    domain = act.split(".")[0]
                    if domain == "valve":
                        service = "open_valve"
                    elif domain == "cover":
                        service = "open_cover"
                    elif domain == "lock":
                        service = "unlock"
                    elif domain == "climate":
                        service = "turn_off"
                    elif domain == "button":
                        service = "press"
                    elif domain == "script":
                        service = act.split(".")[1]
                    else:
                        service = "turn_on"

                    try:
                        await asyncio.wait_for(
                            self.hass.services.async_call(
                                domain, service, {"entity_id": act}
                            ),
                            timeout=REQUEST_TIMEOUT,
                        )
                    except TimeoutError:
                        _LOGGER.error("Timeout executing action %s", act)
                except Exception as err:  # noqa: BLE001
                    _LOGGER.error("Error executing action %s: %s", act, err)

        lang = getattr(self.hass.config, "language", "en") or "en"
        texts = ALARM_MESSAGES.get(lang, ALARM_MESSAGES["en"])
        def_title = glob.get("default_title", "").strip()
        def_msg = glob.get("default_msg", "").strip()

        if is_test:
            title = texts["test_title"].format(cat=cat.upper())
            action_text = "Akcje włączone." if test_action else "Tylko powiadomienie."
            msg = texts["test_msg"].format(cat=cat.upper(), action=action_text)
        else:
            cat_title = texts.get(f"{cat}_title", texts["other_title"])
            title = def_title if def_title else cat_title

            raw_msg = self.custom_messages.get(cat, cfg.get("custom_msg", ""))
            custom_msg = raw_msg.strip() if raw_msg else ""
            msg = (
                custom_msg
                if custom_msg
                else (
                    def_msg if def_msg else texts.get(f"{cat}_msg", texts["other_msg"])
                )
            )

        # 3. Configure DND for Push
        push_data = {}
        if glob.get("push_dnd", True):
            push_data = {
                "push": {
                    "sound": {
                        "name": "default",
                        "critical": 1,
                        "volume": 1.0,
                    }
                },
                "ttl": 0,
                "priority": "high",
                "channel": "alarm_stream",
            }

        # 4. Send notifications via channels
        lights = cfg.get("notify_lights", [])
        for light in lights if isinstance(lights, list) else [lights] if lights else []:
            try:
                payload = {"entity_id": light, "color_name": "red"}
                if glob.get("light_effect", True):
                    payload["flash"] = "long"

                await asyncio.wait_for(
                    self.hass.services.async_call("light", "turn_on", payload),
                    timeout=REQUEST_TIMEOUT,
                )
            except TimeoutError:
                _LOGGER.error("Timeout controlling light %s", light)
            except Exception as err:  # noqa: BLE001
                _LOGGER.error("Error controlling light %s: %s", light, err)

        sirens = cfg.get("notify_sirens", [])
        for siren in sirens if isinstance(sirens, list) else [sirens] if sirens else []:
            try:
                await asyncio.wait_for(
                    self.hass.services.async_call(
                        "siren", "turn_on", {"entity_id": siren}
                    ),
                    timeout=REQUEST_TIMEOUT,
                )
            except TimeoutError:
                _LOGGER.error("Timeout controlling siren %s", siren)
            except Exception as err:  # noqa: BLE001
                _LOGGER.error("Error controlling siren %s: %s", siren, err)

        pushes = cfg.get("notify_push", [])
        for push in pushes if isinstance(pushes, list) else [pushes] if pushes else []:
            try:
                service = push.split(".")[1] if "." in push else push
                await asyncio.wait_for(
                    self.hass.services.async_call(
                        "notify",
                        service,
                        {"title": title, "message": msg, "data": push_data},
                    ),
                    timeout=REQUEST_TIMEOUT,
                )
            except TimeoutError:
                _LOGGER.error("Timeout sending push notification via %s", push)
            except Exception as err:  # noqa: BLE001
                _LOGGER.error("Error sending push notification via %s: %s", push, err)

        ttses = cfg.get("notify_tts", [])
        if ttses and self.is_anyone_home():
            tts_engines = [s.entity_id for s in self.hass.states.async_all("tts")]
            target_engine = glob.get("tts_engine") or (tts_engines[0] if tts_engines else None)
            for tts in ttses if isinstance(ttses, list) else [ttses] if ttses else []:
                try:
                    vol = glob.get("tts_volume", 80) / 100.0
                    await asyncio.wait_for(
                        self.hass.services.async_call(
                            "media_player",
                            "volume_set",
                            {"entity_id": tts, "volume_level": vol},
                        ),
                        timeout=REQUEST_TIMEOUT,
                    )
                    service_data = {
                        "media_player_entity_id": tts,
                        "message": f"Alert! {msg}",
                    }
                    if target_engine:
                        await asyncio.wait_for(
                            self.hass.services.async_call(
                                "tts",
                                "speak",
                                service_data,
                                target={"entity_id": target_engine},
                            ),
                            timeout=REQUEST_TIMEOUT,
                        )
                    else:
                        await asyncio.wait_for(
                            self.hass.services.async_call(
                                "tts",
                                "speak",
                                service_data,
                            ),
                            timeout=REQUEST_TIMEOUT,
                        )
                except TimeoutError:
                    _LOGGER.error("Timeout with TTS on %s", tts)
                except Exception as err:  # noqa: BLE001
                    _LOGGER.error("Error with TTS on %s: %s", tts, err)

        # 5. Start repeat reminder loop for real alerts
        if (
            not is_test
            and glob.get("tts_repeat", False)
            and cat not in self._repeat_tasks
        ):
            coro = self._alert_repeat_loop(
                cat, title, msg, entity_id, cfg, glob, push_data
            )
            self._repeat_tasks[cat] = self.hass.async_create_task(coro)

    async def _alert_repeat_loop(
        self,
        cat: str,
        title: str,
        msg: str,
        entity_id: str,
        cfg: dict[str, Any],
        glob: dict[str, Any],
        push_data: dict[str, Any],
    ) -> None:
        """Repeat alert notifications at intervals."""
        try:
            raw_interval = glob.get("tts_repeat_interval", self.repeat_interval.get(cat, 5))
            try:
                interval = max(1, int(raw_interval))
            except (TypeError, ValueError):
                interval = 5

            while entity_id in self.active_hazards:
                await asyncio.sleep(interval * 60)

                state = self.hass.states.get(entity_id)
                if state and state.state in ("off", "safe", "0"):
                    if entity_id in self.active_hazards:
                        del self.active_hazards[entity_id]
                    if not any(c == cat for c in self.active_hazards.values()):
                        await self.dismiss_alert(cat)
                        break

                # Repeat push notifications
                pushes = cfg.get("notify_push", [])
                for push in (
                    pushes if isinstance(pushes, list) else [pushes] if pushes else []
                ):
                    try:
                        service = push.split(".")[1] if "." in push else push
                        await asyncio.wait_for(
                            self.hass.services.async_call(
                                "notify",
                                service,
                                {
                                    "title": f"🔄 Reminder: {title}",
                                    "message": msg,
                                    "data": push_data,
                                },
                            ),
                            timeout=REQUEST_TIMEOUT,
                        )
                    except TimeoutError:
                        _LOGGER.error("Timeout sending reminder via %s", push)
                    except Exception as err:  # noqa: BLE001
                        _LOGGER.error("Error sending reminder via %s: %s", push, err)

                # Repeat TTS
                ttses = cfg.get("notify_tts", [])
                if ttses and self.is_anyone_home():
                    tts_engines = [s.entity_id for s in self.hass.states.async_all("tts")]
                    target_engine = glob.get("tts_engine") or (tts_engines[0] if tts_engines else None)
                    for tts in (
                        ttses if isinstance(ttses, list) else [ttses] if ttses else []
                    ):
                        try:
                            vol = glob.get("tts_volume", 80) / 100.0
                            await asyncio.wait_for(
                                self.hass.services.async_call(
                                    "media_player",
                                    "volume_set",
                                    {"entity_id": tts, "volume_level": vol},
                                ),
                                timeout=REQUEST_TIMEOUT,
                            )
                            service_data = {
                                "media_player_entity_id": tts,
                                "message": f"Reminder: {msg}",
                            }
                            if target_engine:
                                await asyncio.wait_for(
                                    self.hass.services.async_call(
                                        "tts",
                                        "speak",
                                        service_data,
                                        target={"entity_id": target_engine},
                                    ),
                                    timeout=REQUEST_TIMEOUT,
                                )
                            else:
                                await asyncio.wait_for(
                                    self.hass.services.async_call(
                                        "tts",
                                        "speak",
                                        service_data,
                                    ),
                                    timeout=REQUEST_TIMEOUT,
                                )
                        except TimeoutError:
                            _LOGGER.error("Timeout with TTS reminder on %s", tts)
                        except Exception as err:  # noqa: BLE001
                            _LOGGER.error("Error with TTS reminder on %s: %s", tts, err)

        except asyncio.CancelledError:
            _LOGGER.debug("Alert repeat loop for %s was cancelled", cat)

    async def dismiss_alert(self, cat: str) -> None:
        """Dismiss active alerts for a category."""
        to_remove = [eid for eid, c in self.active_hazards.items() if c == cat]
        for eid in to_remove:
            if eid in self.active_hazards:
                del self.active_hazards[eid]

        if cat in self._repeat_tasks:
            self._repeat_tasks[cat].cancel()
            del self._repeat_tasks[cat]

        if self.sensor:
            self.sensor.update_internal_state()

    # =========================================================
    # --- SILNIK WCZESNEGO OSTRZEGANIA (W TLE) ---
    # =========================================================

    def start_monitoring(self):
        """Uruchamia proces analityczny wczesnego ostrzegania co 5 minut."""
        if self._unsub_predictions is None:
            _LOGGER.debug("Uruchamianie silnika wczesnego ostrzegania (interwal 5 minut)")
            self._unsub_predictions = async_track_time_interval(
                self.hass, self._async_check_predictions, timedelta(minutes=5)
            )

    def stop_monitoring(self):
        """Zatrzymuje proces analityczny i zadania w tle."""
        if self._unsub_predictions is not None:
            self._unsub_predictions()
            self._unsub_predictions = None

        for _cat, task in list(self._repeat_tasks.items()):
            if not task.done():
                task.cancel()
        self._repeat_tasks.clear()

    async def _async_check_predictions(self, now=None):
        """Sprawdza stan encji predykcyjnych pod katem zagrozen dlugoterminowych."""
        cat_cfg = (
            self.category_config
        )  # używamy żywego stanu coordinatora, nie entry_data
        global_cfg = cat_cfg.get("global", {})

        if not global_cfg.get("use_predictions", True):
            return

        monitored_sensors = list(cat_cfg.get("temperature", {}).get("sensors", []))

        for cat_name, cat_data in cat_cfg.items():
            if cat_name != "global":
                monitored_sensors.extend(cat_data.get("predictions", []))

        monitored_sensors = list(set(monitored_sensors))

        for entity_id in monitored_sensors:
            state_obj = self.hass.states.get(entity_id)
            if not state_obj or state_obj.state in (
                STATE_UNAVAILABLE,
                STATE_UNKNOWN,
            ):
                continue

            try:
                temp = float(state_obj.state)
            except ValueError:
                continue

            name = state_obj.attributes.get("friendly_name", entity_id)

            if temp <= 5:
                reason = f"Ryzyko zamarzania ({temp}°C)"
                await self._async_trigger_prediction_alert(
                    entity_id, "freeze", reason, name
                )
            elif temp >= 45:
                reason = f"Ryzyko przegrzania ({temp}°C)"
                await self._async_trigger_prediction_alert(
                    entity_id, "overheat", reason, name
                )
            else:
                if entity_id in self.active_predictions:
                    del self.active_predictions[entity_id]
                    _LOGGER.info("Zagrozenie predykcyjne dla %s zazegnane.", name)

    async def _async_trigger_prediction_alert(
        self, entity_id: str, risk_type: str, reason: str, name: str
    ):
        """Wysyla wczesne powiadomienie uzywajac zdefiniowanych kanalow."""
        if self.active_predictions.get(entity_id) == risk_type:
            return

        self.active_predictions[entity_id] = risk_type
        message = f"🛡️ Wczesne Ostrzeżenie: {reason} wykryte na czujniku {name}!"
        _LOGGER.warning(message)

        cat_cfg = (
            self.category_config
        )  # używamy żywego stanu coordinatora, nie entry_data
        push_channels = cat_cfg.get("global", {}).get("notify_push", [])

        for push_entity in push_channels:
            domain = "notify"
            service = push_entity.replace("notify.", "")
            try:
                await self.hass.services.async_call(
                    domain,
                    service,
                    {
                        "title": "🛡️ Wczesne Ostrzeżenie",
                        "message": message,
                        "data": {"push": {"interruption-level": "time-sensitive"}},
                    },
                )
            except Exception as e:  # noqa: BLE001
                _LOGGER.error("Blad powiadomienia PUSH z predykcji: %s", e)
