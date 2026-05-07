import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';

export class SummaryActions extends HazardBase {

static properties = {
  hass: { type: Object }
};

static styles = css`

.action-btn{
width:100%;
margin-bottom:12px;
}

.action-btn:last-child{
margin-bottom:0;
}

.danger-btn{
--mdc-theme-primary:var(--error-color);
}

.warning-btn{
--mdc-theme-primary:var(--warning-color);
}

`;

_findEntity(domain, keywords){

return Object.keys(this.hass.states)
.find(id =>
id.startsWith(domain + ".") &&
keywords.some(k => id.includes(k))
);

}

render(){

const panicBtn = this._findEntity("button",["dismiss","alarm"]);
const maintenanceSwitch = this._findEntity("switch",["service","maintenance"]);

const isMaintenanceOn = maintenanceSwitch
? this.hass.states[maintenanceSwitch].state === "on"
: false;

return html`

<ha-card header="${this.tt("summary.actions")}">

<div class="card-content">

<ha-button
raised
class="action-btn warning-btn"
@click=${()=>{

if(maintenanceSwitch){

this.hass.callService(
"switch",
"toggle",
{entity_id:maintenanceSwitch}
);

}

}}>

<ha-icon
slot="icon"
icon="${isMaintenanceOn
? 'mdi:wrench'
: 'mdi:wrench-outline'}">
</ha-icon>

${isMaintenanceOn
? this.tt("summary.maintenance_on")
: this.tt("summary.maintenance_enable")}

</ha-button>


<ha-button
raised
class="action-btn"
@click=${()=>console.log("close water")}>

<ha-icon
slot="icon"
icon="mdi:pipe-valve">
</ha-icon>

${this.tt("summary.close_water")}

</ha-button>


<ha-button
raised
class="action-btn danger-btn"
@click=${()=>{

if(panicBtn){

this.hass.callService(
"button",
"press",
{entity_id:panicBtn}
);

}

}}>

<ha-icon
slot="icon"
icon="mdi:alert-octagon">
</ha-icon>

${this.tt("summary.dismiss_alerts")}

</ha-button>

</div>

</ha-card>

`;

}

}

customElements.define(
"summary-actions",
SummaryActions
);