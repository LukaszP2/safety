import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';

export class AnalyticsPredictionsCard extends HazardBase {

  static properties = {
    hass: { type: Object }
  };

  static styles = css`

    ha-card {
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .header {
      font-size: 18px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary-text-color);
    }

    .all-safe-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(var(--rgb-success-color, 76, 175, 80), 0.1);
      border-radius: 8px;
      color: var(--success-color);
      font-weight: 500;
    }

    .risk-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .risk-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      cursor: pointer;
      transition: background-color 0.2s, box-shadow 0.2s;
    }

    .risk-item:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .risk-item.critical {
      background: rgba(var(--rgb-error-color, 244, 67, 54), 0.1);
      border-color: var(--error-color);
    }

    .risk-item.critical:hover {
      background: rgba(var(--rgb-error-color, 244, 67, 54), 0.2);
    }

    .risk-item.safe {
      background: var(--card-background-color);
    }

    .risk-item.safe:hover {
      background: var(--secondary-background-color);
    }

    .risk-info {
      flex: 1;
    }

    .risk-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary-text-color);
    }

    .risk-desc {
      font-size: 12px;
      color: var(--secondary-text-color);
    }

    .risk-value {
      font-weight: 500;
      color: var(--primary-text-color);
    }

  `;

  _openMoreInfo(entityId) {

    if (!entityId) return;

    const event = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true
    });

    this.dispatchEvent(event);
  }

  _getTemperatureRisks() {

    const risks = [];

    const statusEntity = Object.values(this.hass.states)
      .find(e => e.attributes.unique_key === 'status');

    const config = statusEntity?.attributes?.category_config?.temperature || {};
    const monitoredEntities = config.sensors || [];

    monitoredEntities.forEach(entityId => {

      const stateObj = this.hass.states[entityId];

      if (!stateObj || isNaN(stateObj.state)) return;

      const temp = parseFloat(stateObj.state);
      const name = stateObj.attributes.friendly_name || entityId;
      const unit = stateObj.attributes.unit_of_measurement || '°C';

      if (temp <= 5) {

        risks.push({
          entityId,
          type: 'freeze',
          critical: temp <= 0,
          title: this.tt('analytics.freeze_risk'),
          desc: `${name}: `,
          value: `${temp}${unit}`
        });

      }

      if (temp >= 45) {

        risks.push({
          entityId,
          type: 'overheat',
          critical: temp >= 60,
          title: this.tt('analytics.overheat_risk'),
          desc: `${name}: `,
          value: `${temp}${unit}`
        });

      }

    });

    return risks;
  }

  _getSafeMonitoredEntities(activeRiskEntities) {

    const statusEntity = Object.values(this.hass.states)
      .find(e => e.attributes.unique_key === 'status');

    const config = statusEntity?.attributes?.category_config || {};

    const entitiesSet = new Set();

    if (config.temperature?.sensors) {
      config.temperature.sensors.forEach(e => entitiesSet.add(e));
    }

    Object.keys(config).forEach(cat => {

      if (cat !== 'global' && config[cat].predictions) {
        config[cat].predictions.forEach(e => entitiesSet.add(e));
      }

    });

    return Array.from(entitiesSet)
      .filter(id => !activeRiskEntities.includes(id) && this.hass.states[id])
      .map(id => this.hass.states[id]);
  }

  render() {

    const risks = this._getTemperatureRisks();
    const riskEntityIds = risks.map(r => r.entityId);

    const safeEntities = this._getSafeMonitoredEntities(riskEntityIds);

    const noPredictionsText = this.tt('analytics.no_predictions');
    const monitoringSafeText = this.tt('analytics.monitoring_safe');

    return html`

      <ha-card>

        <div class="header">

          <ha-icon
            icon="mdi:brain"
            style="color: var(--primary-color)"
          ></ha-icon>

          ${this.tt('analytics.predictions_title')}

        </div>

        ${risks.length === 0
          ? html`
              <div class="all-safe-header">

                <ha-icon
                  icon="mdi:shield-check-outline"
                  style="--mdc-icon-size: 28px;"
                ></ha-icon>

                <div>${noPredictionsText}</div>

              </div>
            `
          : ''}

        <div class="risk-list">

          ${risks.map(risk => html`

            <div
              class="risk-item ${risk.critical ? 'critical' : ''}"
              @click=${() => this._openMoreInfo(risk.entityId)}
            >

              <ha-icon
                icon="${risk.type === 'freeze'
                  ? 'mdi:snowflake'
                  : 'mdi:thermometer-alert'}"
                style="color:${risk.critical
                  ? 'var(--error-color)'
                  : 'var(--warning-color)'};--mdc-icon-size:24px;"
              ></ha-icon>

              <div class="risk-info">

                <div class="risk-title">${risk.title}</div>

                <div class="risk-desc">
                  ${risk.desc}
                  <span class="risk-value">${risk.value}</span>
                </div>

              </div>

            </div>

          `)}

          ${safeEntities.map(stateObj => {

            const val = stateObj.state;
            const unit = stateObj.attributes.unit_of_measurement || '';
            const name = stateObj.attributes.friendly_name || stateObj.entity_id;
            const icon = stateObj.attributes.icon || 'mdi:check-circle-outline';

            return html`

              <div
                class="risk-item safe"
                @click=${() => this._openMoreInfo(stateObj.entity_id)}
              >

                <ha-icon
                  icon="${icon}"
                  style="color:var(--success-color);--mdc-icon-size:24px;"
                ></ha-icon>

                <div class="risk-info">

                  <div class="risk-title">${name}</div>

                  <div class="risk-desc">
                    ${monitoringSafeText}
                    <span class="risk-value">
                      (${val}${unit})
                    </span>
                  </div>

                </div>

              </div>

            `;

          })}

        </div>

      </ha-card>

    `;
  }
}

customElements.define(
  'analytics-predictions-card',
  AnalyticsPredictionsCard
);