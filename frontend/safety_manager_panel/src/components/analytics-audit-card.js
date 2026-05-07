import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';

export class AnalyticsAuditCard extends HazardBase {

  static properties = {
    hass: { type: Object }
  };

  static styles = css`
    ha-card { border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:20px; }
    .header { font-size:18px;font-weight:500;display:flex;align-items:center;gap:8px; }

    .score-container { display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid var(--divider-color); }

    .score-circle {
      width:80px;height:80px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:28px;font-weight:bold;color:white;
      box-shadow:0 4px 10px rgba(0,0,0,0.2);
    }

    .score-info { flex:1;margin-left:20px; }
    .score-status { font-size:18px;font-weight:500; }

    .score-trend {
      font-size:14px;color:var(--secondary-text-color);
      display:flex;align-items:center;gap:4px;margin-top:4px;
    }

    .audit-grid { display:flex;flex-direction:column;gap:12px; }

    .audit-row { display:flex;align-items:center;justify-content:space-between;font-size:13px; }

    .audit-label { width:40%;color:var(--secondary-text-color);display:flex;align-items:center;gap:8px; }

    .audit-bar-bg {
      flex:1;height:8px;background:var(--secondary-background-color);
      border-radius:4px;overflow:hidden;margin:0 12px;
    }

    .audit-bar-fill { height:100%;border-radius:4px;transition:width .5s ease; }

    .audit-value { width:30px;text-align:right;font-weight:500; }
  `;

  _getColor(val) {
    if (val >= 90) return '#4caf50';
    if (val >= 70) return '#ffc107';
    if (val >= 40) return '#ff9800';
    return '#f44336';
  }

  _getStatus(val) {
    if (val >= 90) return this.tt('analytics.status_very_safe');
    if (val >= 70) return this.tt('analytics.status_good');
    if (val >= 40) return this.tt('analytics.status_medium');
    return this.tt('analytics.status_low');
  }

  render() {

    const scoreState = this.hass?.states['sensor.home_safety_score'];
    const score = scoreState ? parseInt(scoreState.state) : 78;

    const trendState = this.hass?.states['sensor.home_safety_trend'];
    const trend = trendState ? trendState.state : 'improving';

    const auditState = this.hass?.states['sensor.home_safety_audit'];
    const audit = auditState?.attributes || {
      fire_safety:80,
      water_safety:60,
      gas_safety:40,
      environment:90,
      power_safety:70,
      coverage:65
    };

    const trendIcon =
      trend === 'improving'
        ? 'mdi:trending-up'
        : trend === 'declining'
        ? 'mdi:trending-down'
        : 'mdi:trending-neutral';

    const trendLabel =
      trend === 'improving'
        ? this.tt('analytics.trend_improving')
        : trend === 'declining'
        ? this.tt('analytics.trend_declining')
        : this.tt('analytics.trend_stable');

    const categories = [
      { id:'fire_safety',icon:'mdi:fire',label:this.tt('analytics.cat_fire') },
      { id:'water_safety',icon:'mdi:water',label:this.tt('analytics.cat_water') },
      { id:'gas_safety',icon:'mdi:gas-cylinder',label:this.tt('analytics.cat_gas') },
      { id:'environment',icon:'mdi:thermometer',label:this.tt('analytics.cat_env') },
      { id:'power_safety',icon:'mdi:flash',label:this.tt('analytics.cat_power') },
      { id:'coverage',icon:'mdi:radar',label:this.tt('analytics.cat_coverage') }
    ];

    return html`
      <ha-card>

        <div class="header">
          <ha-icon icon="mdi:shield-home"></ha-icon>
          ${this.tt('analytics.score_title')}
        </div>

        <div class="score-container">
          <div class="score-circle" style="background:${this._getColor(score)}">
            ${score}
          </div>

          <div class="score-info">

            <div class="score-status" style="color:${this._getColor(score)}">
              ${this._getStatus(score)}
            </div>

            <div class="score-trend">
              <ha-icon icon="${trendIcon}"></ha-icon>
              ${trendLabel}
            </div>

          </div>
        </div>

        <div class="header">
          <ha-icon icon="mdi:clipboard-check-outline"></ha-icon>
          ${this.tt('analytics.audit_title')}
        </div>

        <div class="audit-grid">

          ${categories.map(cat => {

            const val = audit[cat.id] || 0;

            return html`

              <div class="audit-row">

                <div class="audit-label">
                  <ha-icon icon="${cat.icon}"></ha-icon>
                  ${cat.label}
                </div>

                <div class="audit-bar-bg">
                  <div class="audit-bar-fill"
                       style="width:${val}%;background:${this._getColor(val)}">
                  </div>
                </div>

                <div class="audit-value">${val}</div>

              </div>

            `;

          })}

        </div>

      </ha-card>
    `;
  }
}

customElements.define('analytics-audit-card', AnalyticsAuditCard);