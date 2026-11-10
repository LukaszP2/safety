import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';
import './notification-channels.js';
import './confirm-dialog.js'; // <--- DODANO IMPORT!

export class SettingsChannels extends HazardBase {

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

    .card-header-custom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 16px 0 16px;
    }

    .card-header-title {
      font-size: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .card-header-icon {
      color: var(--primary-color);
    }

  `;

  _update(key, value) {
    this.dispatchEvent(new CustomEvent('update-setting', {
      detail: { key, value },
      bubbles: true,
      composed: true
    }));
  }

  _handleToggleWithConfirm(key, currentValue, titleOn, textOn, titleOff, textOff) {
    const isTurningOff = currentValue === true;

    this._dialogState = {
      settingKey: key,
      title: isTurningOff ? (this.tt(titleOff) || 'Wyłączenie automatyzacji') : (this.tt(titleOn) || 'Włączenie automatyzacji'),
      text: isTurningOff 
        ? (this.tt(textOff) || 'Obecnie przypisane elementy pozostaną na liście, ale od teraz będziesz mógł je edytować, dodawać i usuwać ręcznie. Czy chcesz kontynuować?') 
        : (this.tt(textOn) || 'System automatycznie wyszuka i zablokuje możliwość ręcznej edycji tych elementów. Czy chcesz kontynuować?'),
      icon: 'mdi:alert',
      isDanger: isTurningOff // Zabarwi przycisk na czerwono przy wyłączaniu
    };
  }

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
      this._pendingSwitchTarget.checked = !this._pendingSwitchTarget.checked;
    }
    this._dialogState = null;
    this._pendingSwitchTarget = null;
  }

  render() {
    const cfg = this.config || {};
    const useDefault = cfg.use_default_notifications === true;

    return html`
      <confirm-dialog
        ?open=${this._dialogState !== null}
        .title=${this._dialogState?.title || ''}
        .text=${this._dialogState?.text || ''}
        .icon=${this._dialogState?.icon || 'mdi:alert'}
        .isDanger=${this._dialogState?.isDanger === true}
        confirmText="${this.tt('system.confirm') || 'Potwierdź'}"
        cancelText="${this.tt('system.cancel') || 'Anuluj'}"
        @confirm=${this._confirmDialog}
        @cancel=${this._cancelDialog}
      ></confirm-dialog>

      <ha-card>
        <div class="card-header-custom">
          <div class="card-header-title">
            <ha-icon
              icon="mdi:bell-ring"
              class="card-header-icon"
            ></ha-icon>
            ${this.tt('channels.title') || 'Domyślne kanały powiadomień'}
          </div>

          <ha-switch
            .checked=${useDefault}
            @change=${e => {
              this._pendingSwitchTarget = e.target;
              this._handleToggleWithConfirm(
                'use_default_notifications',
                useDefault,
                'popup_useDefault_on_title', 'popup_useDefault_on_text',
                'popup_useDefault_off_title', 'popup_useDefault_off_text'
              );
            }}
          ></ha-switch>
        </div>

        ${useDefault
          ? html`
            <div style="padding:16px;">
              <notification-channels
                .hass=${this.hass}
                .config=${this.config}
                @config-changed=${e =>
                  this._update(
                    e.detail.key,
                    e.detail.value
                  )
                }
              >
              </notification-channels>
            </div>
          `
          : html`
            <div style="height:16px;"></div>
          `
        }
      </ha-card>
    `;
  }
}

customElements.define('settings-channels', SettingsChannels);