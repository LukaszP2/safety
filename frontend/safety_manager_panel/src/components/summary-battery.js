import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';

export class SummaryBattery extends HazardBase {

static properties = {
  hass: { type: Object }
};

static styles = css`

.list-item{
display:flex;
align-items:center;
padding:10px 0;
border-bottom:1px solid var(--divider-color);
cursor:pointer;
}

.list-item:last-child{
border-bottom:none;
}

.item-name{
flex-grow:1;
font-size:14px;
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
}

.item-value{
font-size:14px;
font-weight:500;
}

.status-error{
color:var(--error-color,#f44336);
}

.status-warning{
color:var(--warning-color,#ff9800);
}

.status-ok{
color:var(--success-color,#4caf50);
}

.empty-state{
text-align:center;
color:var(--secondary-text-color);
padding:20px;
font-style:italic;
}

.big-icon{
font-size:32px;
margin-bottom:8px;
display:block;
}

.section-title{
font-size:12px;
text-transform:uppercase;
color:var(--secondary-text-color);
margin:8px 0;
}

`;

_getMainSensor(){

const id = Object.keys(this.hass.states)
.find(id =>
id.startsWith("sensor.") &&
this.hass.states[id].attributes?.unique_key === "status"
);

return id ? this.hass.states[id] : null;

}

_getConfiguredSensors(){

const main = this._getMainSensor();
if(!main) return [];

const config = main.attributes.category_config || {};
const set = new Set();

Object.values(config).forEach(cat => {
cat.sensors?.forEach(e => set.add(e));
});

return [...set];

}

_getLowBattery(){

const sensors = this._getConfiguredSensors();
const list=[];

sensors.forEach(id=>{

const state = this.hass.states[id];
if(!state) return;

const bat =
state.attributes.battery_level ??
state.attributes.battery;

if(bat !== undefined && bat <= 25){

list.push({
id,
name: state.attributes.friendly_name || id,
level: parseInt(bat)
});

}

});

return list.sort((a,b)=>a.level-b.level);

}

_getOfflineSensors(){

const sensors = this._getConfiguredSensors();
const list=[];

sensors.forEach(id=>{

const state = this.hass.states[id];
if(!state) return;

if(["unknown","unavailable"].includes(state.state)){

list.push({
id,
name: state.attributes.friendly_name || id
});

}

});

return list;

}

_openMoreInfo(entityId){

this.dispatchEvent(new CustomEvent(
'hass-more-info',
{
detail:{entityId},
bubbles:true,
composed:true
}
));

}

render(){

const bats = this._getLowBattery();
const offline = this._getOfflineSensors();

const hasIssues = bats.length > 0 || offline.length > 0;

return html`

<ha-card
header="${this.tt('summary.battery')}">

<div class="card-content">

${hasIssues

? html`

${bats.length > 0
? html`

<div class="section-title">
${this.tt('summary.low_battery')}
</div>

${bats.map(bat=>html`

<div
class="list-item"
@click=${()=>this._openMoreInfo(bat.id)}>

<ha-icon
icon="mdi:battery-alert"
class="status-error"
style="margin-right:12px;">
</ha-icon>

<span class="item-name">
${bat.name}
</span>

<span class="item-value status-error">
${bat.level}%
</span>

</div>

`)}
`
: ''
}

${offline.length > 0
? html`

<div class="section-title">
${this.tt('summary.offline_sensors')}
</div>

${offline.map(dev=>html`

<div
class="list-item"
@click=${()=>this._openMoreInfo(dev.id)}>

<ha-icon
icon="mdi:lan-disconnect"
class="status-warning"
style="margin-right:12px;">
</ha-icon>

<span class="item-name">
${dev.name}
</span>

<span class="item-value status-warning">
${this.tt('summary.offline')}
</span>

</div>

`)}
`
: ''
}

`

: html`

<div class="empty-state">

<ha-icon
icon="mdi:battery-check"
class="status-ok big-icon">
</ha-icon>

${this.tt('summary.battery_ok')}

</div>

`
}

</div>

</ha-card>

`;

}

}

customElements.define(
"summary-battery",
SummaryBattery
);