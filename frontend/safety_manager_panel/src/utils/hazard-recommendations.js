import { getSafetyConfig } from "./safety-config.js";

export function generateRecommendations(hass) {

  if (!hass) return [];

  const config = getSafetyConfig() || {};
  const recos = [];

  const map = {
    fire: {
      hardware: "devices.smoke_sensor",
      icon: "mdi:smoke-detector",
      link: "https://www.amazon.com/smoke-detector"
    },
    water: {
      hardware: "devices.water_leak_sensor",
      icon: "mdi:water-alert",
      link: "https://www.amazon.com/water-leak-sensor"
    },
    gas: {
      hardware: "devices.co_detector",
      icon: "mdi:molecule-co",
      link: "https://www.amazon.com/co-detector"
    },
    temperature: {
      hardware: "devices.temperature_sensor",
      icon: "mdi:thermometer",
      link: "https://www.amazon.com/temperature-sensor"
    },
    power: {
      hardware: "devices.power_meter",
      icon: "mdi:flash",
      link: "https://www.amazon.com/power-meter"
    }
  };

  Object.keys(map).forEach(category => {

    const sensors = config[category]?.sensors || [];

    if (!sensors.length) {

      recos.push({
        category,
        hardwareKey: map[category].hardware,
        icon: map[category].icon,
        link: map[category].link
      });

    }

  });

  return recos;

}
