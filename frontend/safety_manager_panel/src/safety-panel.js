import { LitElement, html, css } from 'lit';
import { t } from './i18n.js';
import './components/tab-summary.js';
import './components/tab-hazards.js';
import './components/tab-status.js';
import './components/tab-analytics.js';
import './components/tab-settings.js';
import './safety-strategy.js';

class SafetyPanel extends LitElement {
  static properties = {
    hass: { type: Object },
    _currentTab: { type: String, state: true },
    _lang: { type: String, state: true }
  };

  constructor() {
    super();
    this._currentTab = 'summary';
    this._lang = 'pl';
  }
  
  connectedCallback() {
    super.connectedCallback();
    this._lang = this.hass?.locale?.language;
  }
  
  updated(changedProperties) {
    if (changedProperties.has('hass')) {
      this._lang = this.hass?.locale?.language;
    }
  }
  
  _getTabs() {
    return [
      { id: 'summary', nameKey: 'tabs.summary', icon: 'mdi:shield-home-outline' },
      { id: 'sensors', nameKey: 'tabs.hazards', icon: 'mdi:shield-search' },
      { id: 'status', nameKey: 'tabs.status', icon: 'mdi:shield-star-outline' },  
      { id: 'analytics', nameKey: 'tabs.analytics', icon: 'mdi:shield-sync' },
      { id: 'settings', nameKey: 'tabs.settings', icon: 'mdi:shield-edit-outline' }
    ];
  }

  static styles = css`
    :host { 
      display: flex; 
      flex-direction: column; 
      height: 100vh; 
      background-color: var(--primary-background-color); 
      color: var(--primary-text-color); 
    }
    
    /* Natywny nagłówek HA (App Bar) */
    .header { 
      background-color: var(--app-header-background-color, var(--primary-color)); 
      color: var(--app-header-text-color, white); 
      font-family: var(--mdc-typography-headline6-font-family, Roboto, sans-serif);
      font-size: var(--mdc-typography-headline6-font-size, 20px);
      font-weight: var(--mdc-typography-headline6-font-weight, 400);
      letter-spacing: var(--mdc-typography-headline6-letter-spacing, 0.0125em);
      height: var(--header-height, 56px); 
      padding: 0 16px; 
      display: flex; 
      align-items: center; 
      gap: 16px; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
      z-index: 2;
    }
    
    /* Natywny pasek zakładek (Tab Bar) */
    .tabs { 
      display: flex; 
      background-color: var(--primary-background-color); 
      border-bottom: 1px solid var(--divider-color); 
      overflow-x: auto; 
      z-index: 1;
      scrollbar-width: none; /* Ukrywa pasek w Firefox */
    }
    .tabs::-webkit-scrollbar { display: none; } /* Ukrywa pasek w Chrome/Safari */

    /* Natywna pojedyncza zakładka (Tab) */
    .tab { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 8px; 
      height: 48px; 
      padding: 0 24px; 
      cursor: pointer; 
      font-family: var(--mdc-typography-button-font-family, Roboto, sans-serif);
      font-size: var(--mdc-typography-button-font-size, 14px);
      font-weight: var(--mdc-typography-button-font-weight, 500);
      letter-spacing: var(--mdc-typography-button-letter-spacing, 0.0892857em);
      text-transform: var(--mdc-typography-button-text-transform, uppercase);
      color: var(--secondary-text-color); 
      border-bottom: 2px solid transparent; 
      transition: color 0.2s, border-bottom-color 0.2s; 
      white-space: nowrap; 
      box-sizing: border-box;
    }
    
    .tab ha-icon { 
      --mdc-icon-size: 20px; 
    }

    .tab:hover { 
      color: var(--primary-text-color); 
      background-color: var(--secondary-background-color, rgba(150,150,150,0.1));
    }
    
    .tab.active { 
      color: var(--primary-color); 
      border-bottom-color: var(--primary-color); 
    }
    
    .content { 
      flex: 1; 
      overflow-y: auto; 
      background-color: var(--primary-background-color); 
    }
  `;

  render() {
    if (!this.hass) return html`<div>${t('panel.loading', this._lang)}</div>`;
    
    const appName = this.hass.localize('component.safety.title') || t('panel.title', this._lang);
    const tabs = this._getTabs();

    return html`
      <div class="header">
        <ha-icon icon="mdi:shield-check-outline"></ha-icon> 
        ${appName}
      </div>

      <div class="tabs">
        ${tabs.map(tab => html`
          <div class="tab ${this._currentTab === tab.id ? 'active' : ''}" 
               @click=${() => this._currentTab = tab.id}>
            <ha-icon icon="${tab.icon}"></ha-icon>
            ${t(tab.nameKey, this._lang)}
          </div>
        `)}
      </div>

      <div class="content" @change-tab=${(e) => this._currentTab = e.detail.tab}>
        ${this._renderTabContent()}
      </div>
    `;
  }

  _renderTabContent() {
    switch (this._currentTab) {
      case 'summary': return html`<tab-summary .hass=${this.hass} .lang=${this._lang}></tab-summary>`;
      case 'sensors': return html`<tab-hazards .hass=${this.hass} .lang=${this._lang}></tab-hazards>`;
      case 'status': return html`<tab-status .hass=${this.hass} .lang=${this._lang}></tab-status>`;
      case 'analytics': return html`<tab-analytics .hass=${this.hass} .lang=${this._lang}></tab-analytics>`;
      case 'settings': return html`<tab-settings .hass=${this.hass} .lang=${this._lang}></tab-settings>`;
      default: return html`<tab-summary .hass=${this.hass} .lang=${this._lang}></tab-summary>`;
    }
  }
}
customElements.define('safety-panel', SafetyPanel);