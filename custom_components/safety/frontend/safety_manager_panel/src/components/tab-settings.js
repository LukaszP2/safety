import { t } from '../i18n.js';
import { LitElement, html, css } from 'lit';
import './settings-system.js';
import './settings-predictions.js';
import './settings-modes.js';
import './settings-channels.js';
import './settings-messages.js';
import { HazardBase } from '../hazard-base.js';

export class TabSettings extends LitElement {
  static properties = { 
    hass: { type: Object },
    _localOverrides: { type: Object, state: true }
  };

  constructor() {
    super();
    // Lokalny bufor gwarantujący błyskawiczną reakcję interfejsu (brak opóźnień)
    this._localOverrides = {}; 
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

  _handleSettingUpdate(e) {
    const { key, value } = e.detail;
    
    // 1. Zapis natychmiastowy do bufora - UI reaguje od razu
    this._localOverrides = { ...this._localOverrides, [key]: value };
    
    // 2. Wysłanie komendy do serwera w tle
    this.hass.callService('safety', 'update_settings', { category: 'global', key: key, value: value })
      .catch(err => console.warn("Safety Error:", err));
  }

  render() {
    const statusId = this._getEntity('sensor', 'status');
    const baseGlobalCfg = this.hass.states[statusId]?.attributes?.category_config?.global || {};
    
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