import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';
import './confirm-dialog.js';

export class SettingsPredictions extends HazardBase {

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

    .card-content {
      padding: 16px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

  `;

  _update(key, value) {

    this.dispatchEvent(new CustomEvent('update-setting', {
      detail: { key, value },
      bubbles: true,
      composed: true
    }));

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

  render() {

    const cfg = this.config || {};

    const usePredictions = cfg.use_predictions === true;
    const autoPredictions = cfg.auto_predictions !== false;

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

            <ha-icon
              icon="mdi:brain"
              class="card-header-icon"
            ></ha-icon>

            ${this.tt('predictions.title')}

          </div>

          <ha-switch
            .checked=${usePredictions}
            @change=${e =>
              this._update('use_predictions', e.target.checked)
            }
          >
          </ha-switch>

        </div>

        ${usePredictions
          ? html`

            <div class="card-content" style="padding-top:8px;">

              <div class="row">

                <div style="display:flex; align-items:center; gap:12px;">

                  <ha-icon
                    icon="mdi:shield-lock-outline"
                    style="color:${autoPredictions
                      ? 'var(--primary-color)'
                      : 'var(--secondary-text-color)'}"
                  ></ha-icon>

                  <div>

                    <div style="font-weight:500;">
                      ${this.tt('predictions.auto_config')}
                    </div>

                    <div style="font-size:11px;color:var(--secondary-text-color)">
                      ${this.tt('predictions.auto_config_desc')}
                    </div>

                  </div>

                </div>

                <ha-switch
                  .checked=${autoPredictions}
                  @change=${e =>
                    this._update('auto_predictions', e.target.checked)
                  }
                >
                </ha-switch>

              </div>

            </div>

          `
          : html`<div style="height:16px;"></div>`
        }

      </ha-card>

    `;
  }

}

customElements.define('settings-predictions', SettingsPredictions);