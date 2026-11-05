"""Constants for Safety integration."""

from datetime import timedelta

DOMAIN = "safety"
STORAGE_KEY = f"{DOMAIN}_storage"
STORAGE_VERSION = 1

SCAN_INTERVAL = timedelta(seconds=30)
REQUEST_TIMEOUT = 10

CONF_NOTIFY_SERVICE = "phone_notify"
CONF_USE_PERSISTENT_NOTIFICATION = "use_persistent_notification"
CONF_DEVICE_ID = "device_id"

CHANNELS = ["ha", "mobile", "tts", "light"]

HAZARD_CATEGORIES = ["water", "fire", "gas", "temperature", "power"]

ERROR_CANNOT_CONNECT = "cannot_connect"
ERROR_INVALID_DEVICE = "invalid_device"
ERROR_UNKNOWN = "unknown"

EVENT_SAFETY_ALERT = "safety_alert"
EVENT_SAFETY_RESTORED = "safety_restored"

MAX_FAILED_UPDATES = 3

HAZARDS = {
    "water_leak": {
        "device_class": "moisture",
        "cat": "water",
        "name": "Water Leak",
    },
    "smoke_detector": {
        "device_class": "smoke",
        "cat": "fire",
        "name": "Smoke",
    },
    "gas_detector": {
        "device_class": "gas",
        "cat": "gas",
        "name": "Gas",
    },
    "co_detector": {
        "device_class": "carbon_monoxide",
        "cat": "gas",
        "name": "Carbon Monoxide",
    },
    "heat_detector": {
        "device_class": "heat",
        "cat": "temperature",
        "name": "High Temperature",
    },
}

ALARM_MESSAGES = {
    "en": {
        "water_title": "‼️ ALARM: WATER LEAK",
        "water_msg": "Water leak detected. System is taking action!",
        "fire_title": "‼️ ALARM: FIRE",
        "fire_msg": "Smoke detected! Evacuate immediately.",
        "gas_title": "‼️ ALARM: GAS/CO",
        "gas_msg": "Gas or Carbon Monoxide leak detected!",
        "temperature_title": "‼️ ALARM: TEMPERATURE",
        "temperature_msg": "Critical temperature detected!",
        "power_title": "‼️ ALARM: POWER ISSUE",
        "power_msg": "Power anomaly detected!",
        "other_title": "‼️ ALARM: HAZARD",
        "other_msg": "Unidentified hazard detected.",
        "test_title": "🧪 SYSTEM TEST ({cat})",
        "test_msg": "This is a test for category: {cat}. {action}",
    },
    "pl": {
        "water_title": "‼️ ALARM: WYCIEK WODY",
        "water_msg": "Wykryto wyciek wody. System podjął działania!",
        "fire_title": "‼️ ALARM: POŻAR",
        "fire_msg": "Wykryto dym! Natychmiast ewakuuj pomieszczenie.",
        "gas_title": "‼️ ALARM: GAZ/CO",
        "gas_msg": "Wykryto wyciek gazu lub tlenku węgla!",
        "temperature_title": "‼️ ALARM: TEMPERATURA",
        "temperature_msg": "Wykryto krytyczną temperaturę!",
        "power_title": "‼️ ALARM: PROBLEM Z PRĄDEM",
        "power_msg": "Wykryto anomalię zasilania!",
        "other_title": "‼️ ALARM: ZAGROŻENIE",
        "other_msg": "Wykryto niezidentyfikowane zagrożenie.",
        "test_title": "🧪 TEST SYSTEMU ({cat})",
        "test_msg": "To jest test dla kategorii: {cat}. {action}",
    },
}
