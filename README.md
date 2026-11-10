# 🛡️ Safety Hub for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![version](https://img.shields.io/badge/HA-2026.3+-blue.svg?style=for-the-badge)](https://www.home-assistant.io)
[![license](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![buy_me_a_coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Donate-yellow.svg?style=for-the-badge)](https://www.buymeacoffee.com/LukaszP2)


[![Otwórz repozytorium w HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=LukaszP2&repository=safety&category=integration)
[![Dodaj integrację do Home Assistant](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=safety)

**Safety Hub** is a state-of-the-art security dashboard that transforms your Home Assistant instance into a professional-grade hazard monitoring center. It prioritizes safety by aggregating fire, water, gas, and CO sensors into a single, intuitive interface.



## ✨ Key Features

* **📊 Smart Status Tile:** A dynamic summary of the 5 main hazard categories: 🔥 **Fire**, 💧 **Water**, ⛽ **Gas**, 🌡️ **Temperature**, and ⚡ **Power**.
* **🏢 Native Floor & Area Support:** Dashboard visual grouping by floors and rooms based on Home Assistant entity areas.
* **🚨 Real-Time Hazard Alerting:** Automatic actuator shutdown (e.g. water valves, gas shutoffs, ventilation, covers) and multi-channel notifications (Push, TTS, sirens, emergency lighting).
* **🧟 Communication Health Monitoring:** Dashboard communication monitoring identifies devices that have not reported updates in over 24 hours.
* **🪫 Low Battery Diagnostics:** Overview of battery-powered hazard detectors (<25% charge) sorted by criticality.
* **🔧 Service Mode:** Global or category-level service mode to suspend alarms during maintenance or sensor testing without false alerts.
* **🧪 Diagnostics Provider:** Built-in anonymized diagnostics export for safe troubleshooting.

## 📸 Dashboard Preview

| System OK | Active Hazard Alert |
| :--- | :--- |
| ![Summary OK](https://via.placeholder.com/400x250?text=System+Safe+Status) | ![Summary Alert](https://via.placeholder.com/400x250?text=Active+Hazards+Alert) |

## 🚀 Installation

### 🚀 Szybka instalacja (1 kliknięcie przez My Home Assistant)

[![Otwórz repozytorium w HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=LukaszP2&repository=safety&category=integration)

Po zainstalowaniu i ponownym uruchomieniu Home Assistant, kliknij poniższy przycisk, aby skonfigurować integrację:

[![Dodaj integrację do Home Assistant](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=safety)


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
3. Attach the anonymized JSON file to your [GitHub Issue](https://github.com/LukaszP2/safety/issues).

## 🛠️ Development

Built for Home Assistant 2026.1+:
* **Backend:** Python 3.12+ with typing.
* **Frontend:** LitElement / Native HA Components.
* **CI/CD:** GitHub Actions with `ruff`, `pytest`, and `hacs/action` validation.

---

### 📝 Example Automation

Safety Hub provides a central `sensor.safety_status` entity (`safe`, `alarm`, `service_mode`). Use it for critical notifications:

```yaml
alias: "Safety: Critical Alert"
trigger:
  - platform: state
    entity_id: sensor.safety_status
    to: "alarm"
action:
  - service: notify.notify
    data:
      title: "🚨 SAFETY HAZARD DETECTED"
      message: "Active hazard alerts: {{ state_attr('sensor.safety_status', 'active_alerts') | join(', ') }}"
      data:
        push:
          sound: "critical_alert.wav"
```