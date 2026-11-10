import { t } from '../i18n.js';
import { LitElement, html, css } from 'lit';
import './settings-system.js';
import './settings-predictions.js';
import './settings-modes.js';
import './settings-channels.js';
import './settings-messages.js';
import {
  fetchSafetyConfig,
  getSafetyConfig,
  subscribeSafetyConfig,
} from '../utils/safety-config.js';

export class TabSettings extends LitElement {
  static properties = { 
    hass: { type: Object },
    _localOverrides: { type: Object, state: true },
    _config: { state: true },
  };

  constructor() {
    super();
    // Lokalny bufor gwarantujący błyskawiczną reakcję interfejsu (brak opóźnień)
    this._localOverrides = {}; 
    this._config = getSafetyConfig();
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsub = subscribeSafetyConfig((cfg) => {
      this._config = cfg;
      this.requestUpdate();
    });
    if (this.hass) {
      fetchSafetyConfig(this.hass);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsub) {
      this._unsub();
      this._unsub = null;
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('hass') && this.hass) {
      fetchSafetyConfig(this.hass);
    }
  }

  static styles = css`
    :host { display: block; padding: 20px; }
  `;

  _getEntity(domain, uniqueKey) {
    if (!this.hass) return null;
    return Object.keys(this.hass.states).find(id => {
      const isDomain = id.startsWith(`${domain}.`);
      return isDomain && this.hass.states[id]?.attributes?.unique_key === uniqueKey;
    });
  }

  async _handleSettingUpdate(e) {
    const { key, value } = e.detail;
    
    // 1. Zapis natychmiastowy do bufora - UI reaguje od razu
    this._localOverrides = { ...this._localOverrides, [key]: value };
    
    // 2. Wysłanie komendy do serwera w tle i odświeżenie konfiguracji
    try {
      await this.hass.callService('safety', 'update_settings', { category: 'global', key: key, value: value });
      await fetchSafetyConfig(this.hass, true);
    } catch (err) {
      console.warn("Safety Error:", err);
    }
  }

  render() {
    const cfg = this._config || getSafetyConfig();
    const baseGlobalCfg = cfg?.global || {};
    
    // Łączymy powolne dane z serwera z błyskawicznym buforem lokalnym
    const globalCfg = { ...baseGlobalCfg, ...this._localOverrides };
    
    return html`
      <settings-system .hass=${this.hass} .config=${globalCfg} @update-setting=${this._handleSettingUpdate}></settings-system>
      
      <settings-predictions .hass=${this.hass} .config=${globalCfg} @update-setting=${this._handleSettingUpdate}></settings-predictions>
      
      <settings-modes .hass=${this.hass} .config=${globalCfg} @update-setting=${this._handleSettingUpdate}></settings-modes>
      
      <settings-channels .hass=${this.hass} .config=${globalCfg} @update-setting=${this._handleSettingUpdate}></settings-channels>
      
      <settings-messages .hass=${this.hass} .config=${globalCfg} @update-setting=${this._handleSettingUpdate}></settings-messages>
    `;
  }
}
customElements.define('tab-settings', TabSettings);
