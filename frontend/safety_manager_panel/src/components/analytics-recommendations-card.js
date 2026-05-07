import { html, css } from "lit";
import { HazardBase } from "../hazard-base.js";
import { generateRecommendations } from "../utils/hazard-recommendations.js";

export class AnalyticsRecommendationsCard extends HazardBase {

  static properties = {
    hass: { type: Object },
    _targetScore: { type: Number, state: true }
  };

  constructor() {
    super();
    this._targetScore = 90;
  }

  static styles = css`

    ha-card {
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .header {
      font-size: 18px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .goal-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 8px;
    }

    .goal-label {
      font-size: 14px;
      font-weight: 500;
    }

    .goal-value {
      font-size: 18px;
      font-weight: bold;
      width: 40px;
      text-align: right;
      color: var(--primary-color);
    }

    .reco-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .reco-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      padding: 12px;
    }

    .reco-text {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .buy-btn {
      --mdc-theme-primary: var(--success-color);
      --mdc-typography-button-font-size: 12px;
    }

  `;

  render() {

    const recommendations = generateRecommendations(this.hass);

    return html`

      <ha-card>

        <div class="header">

          <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>

          ${this.tt("analytics.reco_title")}

        </div>

        <div class="goal-row">

          <div class="goal-label">
            ${this.tt("analytics.target_score")}
          </div>

          <ha-slider
            pin
            min="50"
            max="100"
            step="5"
            .value=${this._targetScore}
            @change=${e => this._targetScore = e.target.value}
          ></ha-slider>

          <div class="goal-value">
            ${this._targetScore}
          </div>

        </div>

        <div>

          ${this.tt("analytics.missing_to_reach", {
            target: this._targetScore
          })}

        </div>

        <div class="reco-list">

          ${recommendations.map(r => html`

            <div class="reco-item">

              <div class="reco-text">

                <ha-icon icon="${r.icon}"></ha-icon>

                ${this.tt(r.hardwareKey)}

              </div>

              <ha-button
                class="buy-btn"
                @click=${() => window.open(r.link, "_blank")}
              >

                <ha-icon icon="mdi:cart-outline"></ha-icon>

                ${this.tt("analytics.buy_now")}

              </ha-button>

            </div>

          `)}

        </div>

      </ha-card>

    `;
  }
}

customElements.define(
  "analytics-recommendations-card",
  AnalyticsRecommendationsCard
);