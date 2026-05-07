import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';
import './confirm-dialog.js';

export class SettingsSystem extends HazardBase {

  static properties = {
    hass: { type: Object },
    config: { type: Object },
    _dialogState: { type: Object, state: true }
  };

  constructor() {
    super();
    this._dialogState = null;
    this._pendingSwitchTarget = null;
  }

  static styles = css`

    ha-card {
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--divider-color);
    }

    .row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

  `;

  _getEntity(domain, uniqueKey) {

    if (!this.hass) return null;

    return Object.keys(this.hass.states).find(
      id =>
        id.startsWith(`${domain}.`) &&
        this.hass.states[id]?.attributes?.unique_key === uniqueKey
    );
  }

  _update(key, value) {

    this.dispatchEvent(
      new CustomEvent('update-setting', {
        detail: { key, value },
        bubbles: true,
        composed: true
      })
    );
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
  }

  _closeDialog() {

    if (this._pendingSwitchTarget) {

      this._pendingSwitchTarget.checked =
        !this._pendingSwitchTarget.checked;

      this._pendingSwitchTarget = null;

    }

    this._dialogState = null;
  }

  render() {

    const cfg = this.config || {};

    const serviceSwitch = this._getEntity('switch', 'global_service');

    const isServiceOn =
      serviceSwitch && this.hass.states[serviceSwitch]
        ? this.hass.states[serviceSwitch].state === 'on'
        : false;

    const autoSensors = cfg.auto_config_sensors === true;
    const autoActuators = cfg.auto_config_actuators === true;

    return html`

      <confirm-dialog
        ?open=${this._dialogState !== null}
        .title=${this._dialogState?.title || ''}
        .text=${this._dialogState?.text || ''}
        .icon=${this._dialogState?.icon || 'mdi:alert'}
        .isDanger=${this._dialogState?.isDanger === true}
        confirmText="${this.tt('system.confirm')}"
        cancelText="${this.tt('system.cancel')}"
        @confirm=${this._confirmDialog}
        @cancel=${this._closeDialog}
      ></confirm-dialog>

      <ha-card header="${this.tt('system.title')}">

        <div class="card-content">

          <div class="row">

            <div style="display:flex; align-items:center; gap:12px;">

              <ha-icon
                icon="mdi:shield-off-outline"
                style="color:${isServiceOn
                  ? 'var(--primary-color)'
                  : 'var(--secondary-text-color)'}"
              ></ha-icon>

              <div>

                <div style="font-weight:500;">
                  ${this.tt('system.service_mode')}
                </div>

                <div style="font-size:11px;color:var(--secondary-text-color)">
                  ${this.tt('system.service_mode_desc')}
                </div>

              </div>

            </div>

          <ha-switch
              .checked=${isServiceOn}
              @change=${() =>
                this.hass.callService(
                  'switch',
                  isServiceOn ? 'turn_off' : 'turn_on',
                  { entity_id: serviceSwitch }
                )
              }
            ></ha-switch>

          </div>

          <div class="row">

            <div style="display:flex; align-items:center; gap:12px;">

              <ha-icon
                icon="mdi:radar"
                style="color:${autoSensors
                  ? 'var(--primary-color)'
                  : 'var(--secondary-text-color)'}"
              ></ha-icon>

              <div>

                <div style="font-weight:500;">
                  ${this.tt('system.auto_sensors')}
                </div>

                <div style="font-size:11px;color:var(--secondary-text-color)">
                  ${this.tt('system.auto_sensors_desc')}
                </div>

              </div>

            </div>

            <ha-switch
              .checked=${autoSensors}
              @change=${e => {
                this._pendingSwitchTarget = e.target;
                this._handleToggleWithConfirm(
                  'auto_config_sensors',
                  autoSensors,
                  'popup_sensors_on_title', 'popup_sensors_on_text',
                  'popup_sensors_off_title', 'popup_sensors_off_text'
                );
              }}
            ></ha-switch>

          </div>

          <div class="row">

            <div style="display:flex; align-items:center; gap:12px;">

              <ha-icon
                icon="mdi:valve"
                style="color:${autoActuators
                  ? 'var(--primary-color)'
                  : 'var(--secondary-text-color)'}"
              ></ha-icon>

              <div>

                <div style="font-weight:500;">
                  ${this.tt('system.auto_actuators')}
                </div>

                <div style="font-size:11px;color:var(--secondary-text-color)">
                  ${this.tt('system.auto_actuators_desc')}
                </div>

              </div>

            </div>

            <ha-switch
              .checked=${autoActuators}
              @change=${e => {
                this._pendingSwitchTarget = e.target;
                this._handleToggleWithConfirm(
                  'auto_config_actuators',
                  autoActuators,
                  'popup_actuators_on_title', 'popup_actuators_on_text',
                  'popup_actuators_off_title', 'popup_actuators_off_text'
                );
              }}
            ></ha-switch>

          </div>

        </div>

      </ha-card>
    `;
  }

}

customElements.define('settings-system', SettingsSystem);