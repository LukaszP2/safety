import { LitElement } from 'lit';
import { setLanguage, t } from './i18n.js';
import {
  fetchSafetyConfig,
  getSafetyConfig,
  subscribeSafetyConfig,
} from './utils/safety-config.js';

export class HazardBase extends LitElement {

  static properties = {
    hass: { type: Object },
    _safetyConfig: { state: true },
  };

  get safetyConfig() {
    return this._safetyConfig || getSafetyConfig();
  }

  // Safety i18n
  tt(key, params = {}) {
    return t(key, this.hass, params);
  }

  // HA translation → Safety fallback
  ha(haKey, safetyKey = null, params = null) {

    if (this.hass?.localize) {

      const txt = this.hass.localize(haKey, params);

      if (txt && txt !== haKey) {
        return txt;
      }

    }

    if (safetyKey) {
      return this.tt(safetyKey, params);
    }

    return haKey;
  }

  // Nazwa encji jak w HA UI
  entityName(entityId) {

    const state = this.hass?.states?.[entityId];

    if (!state) return entityId;

    return (
      state.attributes?.friendly_name ||
      entityId.split('.').pop().replaceAll('_', ' ')
    );
  }

  // Nazwa pomieszczenia
  areaName(areaId) {

    const area =
      this.hass?.areas?.[areaId] ||
      this.hass?.areaRegistry?.[areaId];

    if (!area) return areaId;

    return area.name;
  }

  // Nazwa urządzenia
  deviceName(deviceId) {

    const device =
      this.hass?.devices?.[deviceId] ||
      this.hass?.deviceRegistry?.[deviceId];

    if (!device) return deviceId;

    return device.name_by_user || device.name;
  }

  // Nazwa integracji (np. Zigbee, MQTT, Mobile App)
  integrationName(domain) {

    if (this.hass?.localize) {

      const txt =
        this.hass.localize(
          `component.${domain}.title`
        );

      if (txt && txt !== domain) {
        return txt;
      }

    }

    return domain;
  }

  connectedCallback() {
    super.connectedCallback();

    this._onLangLoaded = () => this.requestUpdate();

    window.addEventListener(
      'language-loaded',
      this._onLangLoaded
    );

    this._unsubConfig = subscribeSafetyConfig((cfg) => {
      this._safetyConfig = cfg;
      this.requestUpdate();
    });

    if (this.hass) {
      fetchSafetyConfig(this.hass);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener(
      'language-loaded',
      this._onLangLoaded
    );

    if (this._unsubConfig) {
      this._unsubConfig();
      this._unsubConfig = null;
    }
  }

  updated(changedProperties) {

    super.updated(changedProperties);

    if (changedProperties.has('hass')) {

      if (this.hass?.language) {
        // synchronizacja języka i18n z HA
        setLanguage(this.hass.language);
      }

      if (this.hass) {
        fetchSafetyConfig(this.hass);
      }

    }
  }
}
