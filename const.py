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
}
