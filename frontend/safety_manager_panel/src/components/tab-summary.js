import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';

import './summary-badges.js';
import './summary-recent-sensors.js';
import './summary-actions.js';
import './summary-battery.js';

export class TabSummary extends HazardBase {

static properties={
hass:{type:Object}
};

static styles=css`
:host{
display:block;
padding:20px;
}

.sections{
display:grid;
grid-template-columns:2fr 1fr;
gap:16px;
}
`;

render(){

return html`

<summary-badges
.hass=${this.hass}>
</summary-badges>

<div class="sections">

<summary-recent-sensors
.hass=${this.hass}>
</summary-recent-sensors>

<div>

<summary-actions
.hass=${this.hass}>
</summary-actions>

<summary-battery
.hass=${this.hass}>
</summary-battery>

</div>

</div>

`;

}

}

customElements.define("tab-summary",TabSummary);