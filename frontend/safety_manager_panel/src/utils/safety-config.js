let cachedConfig = null;
const listeners = new Set();
let pendingPromise = null;

export async function fetchSafetyConfig(hass, force = false) {
  if (!hass) return cachedConfig || {};
  if (cachedConfig && !force) return cachedConfig;
  if (pendingPromise && !force) return pendingPromise;

  pendingPromise = (async () => {
    try {
      let config = null;
      if (typeof hass.callWS === 'function') {
        config = await hass.callWS({ type: 'safety/config' });
      } else if (hass.connection && typeof hass.connection.sendMessagePromise === 'function') {
        config = await hass.connection.sendMessagePromise({ type: 'safety/config' });
      }
      if (config && typeof config === 'object') {
        cachedConfig = config;
        notifyListeners();
      }
      return cachedConfig || {};
    } catch (err) {
      console.error('Failed to load safety config via WebSocket:', err);
      return cachedConfig || {};
    } finally {
      pendingPromise = null;
    }
  })();

  return pendingPromise;
}

export function getSafetyConfig() {
  return cachedConfig || {};
}

export function setSafetyConfig(config) {
  cachedConfig = config;
  notifyListeners();
}

export function subscribeSafetyConfig(callback) {
  listeners.add(callback);
  if (cachedConfig) {
    try {
      callback(cachedConfig);
    } catch (e) {
      console.error('Error in initial safety config callback:', e);
    }
  }
  return () => {
    listeners.delete(callback);
  };
}

function notifyListeners() {
  listeners.forEach((callback) => {
    try {
      callback(cachedConfig);
    } catch (e) {
      console.error('Error in safety config listener:', e);
    }
  });
}
