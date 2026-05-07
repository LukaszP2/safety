import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';
import './confirm-dialog.js';
import './matrix-table.js';

export class SettingsModes extends HazardBase {
  static properties = {
    config: { type: Object },
    _dialogState: { type: Object, state: true }
  };

  constructor() {
    super();
    this._dialogState = null;
    this._pendingSwitchTarget = null;
  }

  _update(key, value) {
    this.dispatchEvent(new CustomEvent('update-setting', { 
      detail: { key, value }, 
      bubbles: true, 
      composed: true 
    }));
  }

  // Logika inteligentnego wyboru strefy
  _handlePresenceToggle(e) {
    const isEnabled = e.target.checked;
    if (!isEnabled) {
      this._update('geolocation', false);
      return;
    }

    const zones = Object.keys(this.hass.states).filter(id => id.startsWith('zone.'));
    
    let selectedZone = 'zone.home'; // Domyślny kandydat

    if (zones.length === 1) {
      // Jeśli jest tylko jedna strefa, wybierz ją bez pytań
      selectedZone = zones[0];
    } else if (!zones.includes('zone.home')) {
      // Jeśli jest wiele stref, ale nie ma "home", ustaw "true" (wymusi wybór z listy)
      selectedZone = "true"; 
    }

    this._update('geolocation', selectedZone);
  }

  // 1. ZAKTUALIZOWANA METODA WYZWALAJĄCA DIALOG (obsługuje WŁĄCZ i WYŁĄCZ)
  _handleToggleWithConfirm(key, currentValue, titleOn, textOn, titleOff, textOff) {
    // Jeśli currentValue to TRUE, znaczy że użytkownik właśnie kliknął, by to WYŁĄCZYĆ
    const isTurningOff = currentValue === true;

    this._dialogState = {
      settingKey: key,
      title: isTurningOff ? (this.tt(titleOff) || 'Wyłączenie automatyzacji') : (this.tt(titleOn) || 'Włączenie automatyzacji'),
      text: isTurningOff 
        ? (this.tt(textOff) || 'Obecnie przypisane elementy pozostaną na liście, ale od teraz będziesz mógł je edytować, dodawać i usuwać ręcznie. Czy chcesz kontynuować?') 
        : (this.tt(textOn) || 'System automatycznie wyszuka i zablokuje możliwość ręcznej edycji tych elementów. Czy chcesz kontynuować?')
    };
  }

  // 2. METODY ZATWIERDZANIA I ANULOWANIA (Mają już poprawny odczyt stanu)
  _confirmDialog() {
    if (this._dialogState) {
      const key = this._dialogState.settingKey;
      const realValue = this._pendingSwitchTarget ? this._pendingSwitchTarget.checked : true;
      
      this._update(key, realValue);

      this._dialogState = null;
      this._pendingSwitchTarget = null;
    }
  }

  _cancelDialog() {
    if (this._pendingSwitchTarget) {
      // Wizualnie cofamy przełącznik do stanu sprzed kliknięcia
      this._pendingSwitchTarget.checked = !this._pendingSwitchTarget.checked;
    }
    this._dialogState = null;
    this._pendingSwitchTarget = null;
  }v

  render() {
    const useHomeModes = this.config.use_home_modes === true;
    const modeType = this.config.home_mode_type || 'custom';
    
    const alarmEntities = Object.keys(this.hass.states).filter(
        id => id.startsWith('alarm_control_panel.') && this.hass.states[id].state !== 'unavailable'
    );
    const zoneEntities = Object.keys(this.hass.states).filter(id => id.startsWith('zone.'));
    
    // Obecność jest włączona, jeśli geolocation nie jest false
    const presenceEnabled = this.config.geolocation !== false && this.config.geolocation !== undefined;
    const currentZone = typeof this.config.geolocation === 'string' ? this.config.geolocation : '';
    const isValidZone = currentZone.startsWith('zone.');

    return html`

      ${this._dialogState ? html`
     <confirm-dialog
       .title=${this._dialogState.title}
       .text=${this._dialogState.text}
       @confirm=${this._confirmDialog}
       @cancel=${this._cancelDialog}
     ></confirm-dialog>
   ` : ''}

      <ha-card>
        <div class="card-header-custom">
          <div class="card-header-title">
            <ha-icon icon="mdi:home-account" class="card-header-icon"></ha-icon> 
            ${this.tt('settings.home_modes')}
          </div>
          <ha-switch 
            .checked=${useHomeModes} 
            @change=${(e) => this._update('use_home_modes', e.target.checked)}>
          </ha-switch>
        </div>
        
        ${useHomeModes ? html`
          <div class="card-content" style="padding-top: 0;">
            <div class="radio-group">
              
              ${alarmEntities.length > 0 ? html`
                <ha-formfield .label=${this.tt('settings.alarm_integration')}>
                  <ha-radio 
                    name="mode_type" 
                    value="alarm" 
                    .checked=${modeType === 'alarm'} 
                    @change=${() => this._update('home_mode_type', 'alarm')}>
                  </ha-radio>
                </ha-formfield>
                
                ${modeType === 'alarm' ? html`
                  <div style="margin-left:36px; margin-bottom: 12px; margin-top: 8px;">
                    <select 
                      style="padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color);"
                      @change=${(e) => this._update('alarm_entity', e.target.value)}>
                      <option value="" disabled ?selected=${!this.config.alarm_entity}>-- ${this.tt('settings.select_alarm')} --</option>
                      ${alarmEntities.map(ent => html`
                        <option value="${ent}" ?selected=${this.config.alarm_entity === ent}>
                          ${this.hass.states[ent].attributes.friendly_name || ent}
                        </option>
                      `)}
                    </select>
                  </div>
                ` : ''}
              ` : ''}

              <ha-formfield .label=${this.tt('settings.custom_modes')}>
                <ha-radio 
                  name="mode_type" 
                  value="custom" 
                  .checked=${modeType === 'custom'} 
                  @change=${() => this._update('home_mode_type', 'custom')}>
                </ha-radio>
              </ha-formfield>
              
              ${modeType === 'custom' ? html`
                <div style="margin-left:36px; display:flex; flex-direction:column; gap:12px; margin-top: 8px;">
                  
                  <div style="display:flex; flex-direction:column; gap:8px;">
                    <ha-formfield .label=${this.tt('settings.use_presence')}>
                      <ha-switch 
                        .checked=${presenceEnabled} 
                        @change=${this._handlePresenceToggle}>
                      </ha-switch>
                    </ha-formfield>

                    ${presenceEnabled ? html`
                      <div style="margin-left: 12px; margin-top: 4px;">
                        ${zoneEntities.length === 1 ? html`
                          <div class="alarm-badge">
                            <ha-icon icon="mdi:map-marker-radius" style="--mdc-icon-size: 16px;"></ha-icon>
                            ${this.tt('settings.auto_selected')} ${this.hass.states[zoneEntities[0]]?.attributes?.friendly_name || zoneEntities[0]}
                          </div>
                        ` : html`
                          <select 
                            style="padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color);"
                            @change=${(e) => this._update('geolocation', e.target.value)}>
                            <option value="true" disabled ?selected=${!isValidZone}>-- ${this.tt('settings.select_zone')} --</option>
                            ${zoneEntities.map(ent => html`
                              <option value="${ent}" ?selected=${currentZone === ent}>
                                ${this.hass.states[ent]?.attributes?.friendly_name || ent}
                              </option>
                            `)}
                          </select>
                        `}
                      </div>
                    ` : ''}
                  </div>
                  
                  <ha-formfield .label=${this.tt('settings.use_night_mode')}>
                    <ha-switch 
                      .checked=${this.config.use_night_mode === true} 
                      @change=${(e) => this._update('use_night_mode', e.target.checked)}>
                    </ha-switch>
                  </ha-formfield>
                  
                  ${this.config.use_night_mode ? html`
                    <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center;">
                      <ha-textfield label="${this.tt('settings.night_start')}" type="time" .value=${this.config.night_start || '22:00'} @change=${(e) => this._update('night_start', e.target.value)}></ha-textfield>
                      <ha-textfield label="${this.tt('settings.night_end')}" type="time" .value=${this.config.night_end || '06:00'} @change=${(e) => this._update('night_end', e.target.value)}></ha-textfield>
                    </div>
                  ` : ''}
                </div>
              ` : ''}
            </div>

            <div class="row" style="margin-top: 16px; border-top: 1px solid var(--divider-color); border-bottom: none; padding-top: 16px; padding-bottom: 8px;">
              <div>
                <div style="font-weight: 500;">${this.tt('settings.global_matrix_title')}</div>
                <div style="font-size:11px; color:var(--secondary-text-color)">${this.tt('settings.global_matrix_desc')}</div>
              </div>
              <ha-switch 
                .checked=${this.config.global_home_modes === true} 
                @change=${(e) => this._update('global_home_modes', e.target.checked)}>
              </ha-switch>
            </div>
            
            ${this.config.global_home_modes ? html`
              <matrix-table 
                .hass=${this.hass}
                .matrix=${this.config.global_mode_matrix} 
                .modeType=${modeType}
                .showAway=${modeType === 'alarm' || presenceEnabled}
                .showNight=${modeType === 'alarm' || this.config.use_night_mode}
                .showVacation=${modeType === 'alarm' || (presenceEnabled && isValidZone)}
                .showPrediction=${this.config.use_predictions === true}
                @matrix-change=${(e) => this._update('global_mode_matrix', e.detail.matrix)}>
              </matrix-table>
            ` : ''}
          </div>
        ` : ''}
      </ha-card>
    `;
  }

  static styles = css`
    ha-card { border-radius: 12px; margin-bottom: 24px; overflow: visible !important; }
    .card-content { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
    .card-header-custom { display: flex; justify-content: space-between; align-items: center; padding: 16px 16px 0 16px; }
    .card-header-title { font-size: 20px; font-weight: 400; display: flex; align-items: center; gap: 12px; }
    .card-header-icon { color: var(--primary-color); }
    .radio-group { display: flex; flex-direction: column; gap: 8px; }
    .alarm-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 12px; font-size: 12px; background: rgba(var(--rgb-primary-color), 0.1); border: 1px solid var(--primary-color); color: var(--primary-text-color); }
    .row { display: flex; justify-content: space-between; align-items: center; }
  `;
}
customElements.define('settings-modes', SettingsModes);