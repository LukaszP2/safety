import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';

import './analytics-audit-card.js';
import './analytics-predictions-card.js';
import './analytics-recommendations-card.js';

export class TabAnalytics extends HazardBase {

  static properties = {
    hass: { type: Object }
  };

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }

    .grid-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: start;
    }

    @media (max-width: 800px) {
      .grid-layout {
        grid-template-columns: 1fr;
      }
    }
  `;

  render() {

    return html`

      <div class="grid-layout">

        <analytics-audit-card
          .hass=${this.hass}
        ></analytics-audit-card>

        <div style="display:flex;flex-direction:column;gap:24px;">

          <analytics-predictions-card
            .hass=${this.hass}
          ></analytics-predictions-card>

          <analytics-recommendations-card
            .hass=${this.hass}
          ></analytics-recommendations-card>

        </div>

      </div>

    `;
  }
}

customElements.define('tab-analytics', TabAnalytics);