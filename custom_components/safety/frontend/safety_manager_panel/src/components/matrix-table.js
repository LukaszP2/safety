import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';

export class MatrixTable extends HazardBase {

  static properties = {
    matrix: { type: Object },
    isReadOnly: { type: Boolean },
    modeType: { type: String },
    showAway: { type: Boolean },
    showNight: { type: Boolean },
    showVacation: { type: Boolean },
    showPrediction: { type: Boolean }
  };

  _haOrTt(haKey, safetyKey) {
    return this.hass?.localize?.(haKey) || this.tt(safetyKey);
  }

  _getModeLabel(modeId) {

    const haKeyMap = {
      home: "armed_home",
      away: "armed_away",
      night: "armed_night",
      vacation: "armed_vacation"
    };

    const haKey = haKeyMap[modeId];

    if (this.hass?.localize && haKey) {

      const label = this.hass.localize(
        `component.alarm_control_panel.entity_component._.state.${haKey}`
      );

      if (label) {
        const match = label.match(/\((.*?)\)/);
        if (match) return match[1];
        return label;
      }
    }

    return this.tt(`matrix.${modeId}`);
  }

  render() {

    const modes = [
      { id: 'home', show: true },
      { id: 'away', show: this.showAway },
      { id: 'vacation', show: this.showVacation },
      { id: 'night', show: this.showNight },
      { id: 'prediction', show: this.showPrediction }
    ]
      .filter(m => m.show)
      .map(m => ({
        id: m.id,
        label: m.id === "prediction"
          ? this.tt('matrix.prediction')
          : this._getModeLabel(m.id)
      }));


const actions = [
  {
    id: "actuators",
    label: this.hass?.localize?.("ui.panel.config.devices.caption") // "Urządzenia"
      || this.hass?.localize?.("ui.sidebar.config") // Fallback: "Ustawienia"
      || this.tt("matrix.actuators")
  },
  {
    id: "notify_ha",
    label: this.hass?.localize?.("ui.notification_drawer.title") // "Powiadomienia"
      || this.tt("matrix.notify_ha")
  },
  {
    id: "push",
    label: this.hass?.localize?.("ui.panel.config.mobile_app.caption") // "Aplikacja mobilna"
      || this.tt("matrix.push")
  },
  {
    id: "tts",
    label: this.hass?.localize?.("component.media_player.entity_component._.name") 
      || this.tt("matrix.tts")
  },
  {
    id: "sirens",
    label: this.hass?.localize?.("component.siren.entity_component._.name") 
      || this.tt("matrix.sirens")
  },
  {
    id: "lights",
    label: this.hass?.localize?.("component.light.entity_component._.name") 
      || this.tt("matrix.lights")
  },
  {
    id: "automations",
    label: this.hass?.localize?.("ui.panel.config.automation.caption") // "Automatyzacje"
      || this.hass?.localize?.("component.script.entity_component._.name")
      || this.tt("matrix.automations")
  }
];

    const currentMatrix = this.matrix || {};

    return html`
      <div class="matrix-container ${this.isReadOnly ? 'readonly' : ''}">

        <table class="matrix-table">

          <thead>
            <tr>
              <th class="sticky-col">${this.tt('matrix.mode')}</th>
              ${actions.map(a => html`<th>${a.label}</th>`)}
            </tr>
          </thead>

          <tbody>

            ${modes.map(mode => html`
              <tr>

                <td class="sticky-col">${mode.label}</td>

                ${actions.map(action => html`
                  <td>

                    <ha-checkbox
                      .checked=${currentMatrix[mode.id]
                        ? currentMatrix[mode.id][action.id] !== false
                        : true}

                      ?disabled=${this.isReadOnly}

                      @change=${e =>
                        this._handleChange(mode.id, action.id, e.target.checked)
                      }
                    >
                    </ha-checkbox>

                  </td>
                `)}

              </tr>
            `)}

          </tbody>

        </table>

      </div>
    `;
  }

  _handleChange(mode, action, isChecked) {

    if (this.isReadOnly) return;

    const newMatrix = structuredClone(this.matrix || {});

    if (!newMatrix[mode]) newMatrix[mode] = {};

    newMatrix[mode][action] = isChecked;

    this.dispatchEvent(new CustomEvent('matrix-change', {
      detail: { matrix: newMatrix },
      bubbles: true,
      composed: true
    }));
  }

  static styles = css`

    .matrix-container {
      overflow: auto;
      margin-top: 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      max-height: 420px;
    }

    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      min-width: 700px;
    }

    thead th {
      position: sticky;
      top: 0;
      background: var(--card-background-color);
      z-index: 3;
      padding: 12px 8px;
      border-bottom: 1px solid var(--divider-color);
      color: var(--secondary-text-color);
      font-weight: 500;
    }

    .matrix-table td {
      text-align: center;
      padding: 8px;
      border-bottom: 1px solid var(--divider-color);
    }

    .matrix-table td:first-child {
      text-align: left;
      padding-left: 16px;
      font-weight: 500;
    }

    .sticky-col {
      position: sticky;
      left: 0;
      background: var(--card-background-color);
      z-index: 2;
    }

    thead .sticky-col {
      z-index: 4;
    }

    .readonly {
      opacity: 0.6;
      pointer-events: none;
    }

  `;
}

customElements.define('matrix-table', MatrixTable);