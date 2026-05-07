# 🛡️ Safety Hub for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![version](https://img.shields.io/badge/HA-2026.3+-blue.svg?style=for-the-badge)](https://www.home-assistant.io)
[![license](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![buy_me_a_coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Donate-yellow.svg?style=for-the-badge)](https://www.buymeacoffee.com/yourusername)

**Safety Hub** is a state-of-the-art security dashboard that transforms your Home Assistant instance into a professional-grade hazard monitoring center. It prioritizes safety by aggregating fire, water, gas, and CO sensors into a single, intuitive interface.



## ✨ Key Features

* **📊 Smart Status Tile:** A dynamic summary of the 4 main risks: 🔥 **Fire**, 💧 **Water**, ⛽ **Gas**, and ☠ **CO**. The system automatically highlights active alerts and sensor counts.
* **🏢 Native Floor Support:** Full integration with Home Assistant's Floor system. Your rooms are automatically grouped and sorted by floor level.
* **🚨 Alert Prioritization:** Rooms with active hazards are automatically "floated" to the top of the dashboard for immediate visibility.
* **🧟 "Zombie" Detection:** Advanced communication monitoring. Detects devices that haven't updated their state in over 24 hours—crucial for maintaining Zigbee/Z-Wave stability.
* **🪫 Battery Monitoring:** A dedicated section for low-power devices (<25%), sorted by criticality.
* **🔧 Service Mode:** Temporarily suspend monitoring during maintenance or battery replacement to prevent false alarms.
* **🧪 Diagnostics Provider:** Built-in secure (anonymized) diagnostics for easier troubleshooting and bug reporting.

## 📸 Dashboard Preview

| System OK | Active Hazard Alert |
| :--- | :--- |
| ![Summary OK](https://via.placeholder.com/400x250?text=System+Safe+Status) | ![Summary Alert](https://via.placeholder.com/400x250?text=Active+Hazards+Alert) |

## 🚀 Installation

### Method 1: HACS (Recommended)
1. Open **HACS** -> **Integrations**.
2. Click the three dots in the top right and select **Custom repositories**.
3. Paste this repository's URL, select `Integration` as the category, and click **Add**.
4. Find **Safety Hub** and click **Download**.
5. Restart Home Assistant.

### Method 2: Manual
1. Download the `custom_components/safety/` folder.
2. Copy it into your `/config/custom_components/` directory.
3. Restart Home Assistant.

## ⚙️ Configuration

1. Go to **Settings** -> **Devices & Services**.
2. Click **Add Integration** and search for **Safety Hub**.
3. Once added, click **Configure** to adjust:
    * Battery alert thresholds.
    * Inactivity timeout for Zombie detection.
    * Monitored sensor categories.

## 🔍 Support & Diagnostics

If you encounter an issue:
1. Go to the Safety Hub integration settings.
2. Click **Download Diagnostics**.
3. Attach the anonymized JSON file to your [GitHub Issue](https://github.com/yourusername/safety/issues).

## 🛠️ Development

Built for Home Assistant 2026.3+:
* **Backend:** Python 3.13+ with strict typing.
* **Frontend:** LitElement / Native HA Components.
* **CI/CD:** GitHub Actions with `hassfest` and `hacs/action` validation.

---

### 📝 Example Automation

Safety Hub provides a central `sensor.safety_hub_status` entity. Use it for critical notifications:

```yaml
alias: "Safety: Critical Alert"
trigger:
  - platform: state
    entity_id: sensor.safety_hub_status
    to: "Fire"
action:
  - service: notify.all_devices
    data:
      title: "🚨 FIRE HAZARD DETECTED"
      message: "Smoke detected in: {{ state_attr('sensor.safety_hub_status', 'active_areas') }}"
      data:
        push:
          sound: "critical_alert.wav"