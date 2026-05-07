import { t } from '../i18n.js';
import { LitElement, html, css } from 'lit';

export class EntityListCard extends LitElement {
  static properties = {
    hass: { type: Object },
    title: { type: String },
    icon: { type: String },
    list: { type: Array },
    domains: { type: Array },
    isReadOnly: { type: Boolean },
    pickerPlaceholder: { type: String },
    category: { type: String },
    _isPickerOpen: { type: Boolean, state: true },
    _pickerSearch: { type: String, state: true }
  };

  constructor() {
    super();
    this.list = [];
    this.domains = [];
    this.isReadOnly = false;
    this.pickerPlaceholder = "Dodaj urządzenie do listy...";
    this.category = null;
    this._isPickerOpen = false;
    this._pickerSearch = '';
  }

  static styles = css`
    .ha-automation-card { border: 1px solid var(--divider-color, #444); border-radius: 12px; margin-bottom: 16px; background: var(--card-background-color, #1c1c1c); overflow: visible !important; }
    .ha-automation-header { padding: 16px; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 16px; color: var(--primary-text-color); }
    .ha-automation-body { padding: 0 16px 16px 16px; display: flex; flex-direction: column; gap: 12px; overflow: visible !important; }
    
    /* --- ZMIENIONE: WIDOK BADGES --- */
    .badges-container { 
      display: flex; 
      flex-wrap: wrap; 
      gap: 8px; 
      align-items: center;
    }
    
    .entity-badge { 
      display: inline-flex; 
      align-items: center; 
      gap: 6px; 
      padding: 6px 12px; 
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1); 
      border: 1px solid var(--primary-color); 
      border-radius: 16px; 
      font-size: 13px; 
      color: var(--primary-text-color); 
      transition: background-color 0.2s;
    }
    
    .entity-badge.readonly {
      background: var(--secondary-background-color);
      border-color: var(--divider-color);
      color: var(--secondary-text-color);
    }

    .badge-icon { --mdc-icon-size: 16px; }
    .badge-name { font-weight: 500; white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
    
    .remove-btn { 
      color: var(--secondary-text-color); 
      cursor: pointer; 
      transition: color 0.2s; 
      --mdc-icon-size: 16px; 
      margin-left: 2px;
    }
    .remove-btn:hover { color: var(--error-color, #f44336); }
    /* ------------------------------- */
    
    .picker-container { position: relative; width: 100%; margin-top: 8px; }
    .picker-input-wrapper { display: flex; align-items: center; padding: 12px 16px; border: 1px dashed var(--divider-color, #666); border-radius: 8px; cursor: pointer; color: var(--secondary-text-color); transition: border-color 0.2s; }
    .picker-input-wrapper:hover { border-color: var(--primary-color); color: var(--primary-text-color); }
    .picker-dropdown { position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: var(--card-background-color); border: 1px solid var(--divider-color); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 100; max-height: 250px; overflow-y: auto; }
    .search-box { padding: 12px; border-bottom: 1px solid var(--divider-color); position: sticky; top: 0; background: var(--card-background-color); z-index: 2; }
    .search-box input { width: 100%; padding: 8px; border: 1px solid var(--divider-color); border-radius: 4px; background: var(--secondary-background-color); color: var(--primary-text-color); outline: none; box-sizing: border-box; }
    
    .custom-picker-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; cursor: pointer; border-bottom: 1px solid var(--divider-color); }
    .custom-picker-item:last-child { border-bottom: none; }
    .custom-picker-item:hover { background: var(--secondary-background-color); }
    .item-icon { color: var(--secondary-text-color); --mdc-icon-size: 20px; }
    .item-text { flex: 1; overflow: hidden; }
    .item-title { font-size: 14px; font-weight: 500; color: var(--primary-text-color); white-space: nowrap; text-overflow: ellipsis; overflow: hidden; display: flex; align-items: center; }
    .item-subtitle { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
    .area-badge { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1); color: var(--primary-color); padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500; margin-left: 8px; }
  `;

  _isMatch(stateObj) {
    if (!this.category) return true;
    
    const rules = {
      water: { classes: ['moisture', 'water', 'leak', 'flood'], keywords: ['zalani', 'wod', 'wilgot', 'przeciek', 'leak', 'water', 'moisture', 'flood'] },
      fire: { classes: ['smoke', 'fire', 'heat'], keywords: ['pozar', 'pożar', 'dym', 'ogie', 'heat', 'smoke', 'fire', 'temperatura'] },
      gas: { classes: ['gas', 'volatile_organic_compounds'], keywords: ['gaz', 'gas', 'lpg', 'co', 'tlenek', 'voc', 'carbon monoxide'] },
      temperature: { classes: ['temperature'], keywords: ['temperatura', 'temp', 'temperature'] },
      power: { classes: ['power', 'energy', 'voltage', 'current'], keywords: ['zasilanie', 'energia', 'prad', 'prąd', 'napiecie', 'napięcie', 'power', 'energy', 'voltage', 'current'] }
    };

    const rule = rules[this.category];
    if (!rule) return true;

    const entityId = stateObj.entity_id.toLowerCase();
    const friendlyName = (stateObj.attributes.friendly_name || '').toLowerCase();
    const deviceClass = stateObj.attributes.device_class;

    if (deviceClass && rule.classes.includes(deviceClass)) return true;
    return rule.keywords.some(k => friendlyName.includes(k) || entityId.includes(k));
  }

  _getAvailableEntities() {
    if (!this.hass) return [];
    const safeList = Array.isArray(this.list) ? this.list : [];
    
    return Object.values(this.hass.states)
      .filter(state => {
        const domain = state.entity_id.split('.')[0];
        const isDomainOk = !this.domains || this.domains.length === 0 || this.domains.includes(domain);
        const isNotAdded = !safeList.includes(state.entity_id);
        const isIntelligentMatch = this._isMatch(state);
        return isDomainOk && isNotAdded && isIntelligentMatch;
      })
      .map(state => state.entity_id);
  }

  render() {
    const availableEntities = this._getAvailableEntities();
    const filteredEntities = availableEntities.filter(ent => {
      const state = this.hass.states[ent];
      if (!state) return false;
      const name = (state.attributes.friendly_name || '').toLowerCase();
      const id = ent.toLowerCase();
      const search = this._pickerSearch.toLowerCase();
      return name.includes(search) || id.includes(search);
    });

    const safeList = Array.isArray(this.list) ? this.list : [];

    return html`
      <div class="ha-automation-card">
        ${this.title ? html`
          <div class="ha-automation-header">
            ${this.icon ? html`<ha-icon icon="${this.icon}"></ha-icon>` : ''}
            ${this.title}
          </div>
        ` : ''}
        
        <div class="ha-automation-body">
          ${safeList.length > 0 ? html`
            <div class="badges-container">
              ${safeList.map(entityId => {
                const stateObj = this.hass?.states[entityId];
                const name = stateObj?.attributes?.friendly_name || entityId;
                const icon = stateObj?.attributes?.icon || 'mdi:cube-outline';

                return html`
                  <div class="entity-badge ${this.isReadOnly ? 'readonly' : ''}" title="${entityId}">
                    <ha-icon icon="${icon}" class="badge-icon"></ha-icon>
                    <span class="badge-name">${name}</span>
                    ${!this.isReadOnly ? html`
                      <ha-icon 
                        icon="mdi:close-circle" 
                        class="remove-btn" 
                        @click=${() => this._handleRemove(entityId)}>
                      </ha-icon>
                    ` : html`
                      <ha-icon icon="mdi:lock" style="color: var(--secondary-text-color); --mdc-icon-size: 14px; opacity: 0.5; margin-left: 4px;"></ha-icon>
                    `}
                  </div>
                `;
              })}
            </div>
          ` : ''}

          <div class="picker-container">
            ${!this.isReadOnly ? html`
              <div class="picker-input-wrapper" @click=${() => this._isPickerOpen = !this._isPickerOpen}>
                <ha-icon icon="mdi:plus" style="margin-right: 8px;"></ha-icon>
                ${this.pickerPlaceholder}
              </div>
            ` : ''}

            ${this._isPickerOpen && !this.isReadOnly ? html`
              <div style="position: fixed; inset: 0; z-index: 99;" @click=${() => this._isPickerOpen = false}></div>
              
              <div class="picker-dropdown">
                <div class="search-box">
                  <input 
                    type="text" 
                    placeholder="Wyszukaj urządzenie..." 
                    .value=${this._pickerSearch} 
                    @input=${(e) => this._pickerSearch = e.target.value}
                    @click=${(e) => e.stopPropagation()}
                    autofocus
                  >
                </div>
                <div>
                  ${filteredEntities.map(ent => {
                    const state = this.hass.states[ent];
                    const name = state.attributes.friendly_name || ent;
                    const icon = state.attributes.icon || 'mdi:cube-outline';
                    const area = state.attributes.area_id || '';
                    
                    return html`
                      <div class="custom-picker-item" @click=${(e) => {
                        e.stopPropagation(); 
                        this._handleAdd(ent);
                      }}>
                        <ha-icon icon="${icon}" class="item-icon"></ha-icon>
                        <div class="item-text">
                          <div class="item-title">
                            ${name}
                            ${area ? html`<span class="area-badge">${area}</span>` : ''}
                          </div>
                          <div class="item-subtitle">${ent}</div>
                        </div>
                      </div>
                    `;
                  })}
                  ${filteredEntities.length === 0 ? html`
                    <div style="padding: 16px; text-align: center; color: var(--secondary-text-color); font-size: 13px;">
                      Brak wyników wyszukiwania
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}
          </div>
          
          <slot></slot>
        </div>
      </div>
    `;
  }

  _handleAdd(entityId) {
    this._isPickerOpen = false;
    this._pickerSearch = '';
    this.dispatchEvent(new CustomEvent('add-entity', { detail: { entityId }, bubbles: true, composed: true }));
  }

  _handleRemove(entityId) {
    this.dispatchEvent(new CustomEvent('remove-entity', { detail: { entityId }, bubbles: true, composed: true }));
  }
}
customElements.define('entity-list-card', EntityListCard);