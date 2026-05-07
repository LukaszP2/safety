import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';

export class SummaryBadges extends HazardBase {

static properties = {
  hass: { type: Object }
};

static styles = css`

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
gap:16px;
margin-bottom:24px;
}

.tile{
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
height:130px;
text-align:center;
cursor:pointer;

transition:
transform 0.2s cubic-bezier(0.25,0.8,0.25,1),
border-color 0.2s;
}

.tile:hover{
transform:translateY(-4px);
border-color:var(--primary-color);
}

.tile:active{
transform:translateY(2px);
}

.tile ha-icon{
--mdc-icon-size:36px;
margin-bottom:8px;
}

.value{
font-size:28px;
font-weight:bold;
line-height:1.2;
}

.label{
font-size:11px;
color:var(--secondary-text-color);
text-transform:uppercase;
margin-top:6px;
letter-spacing:0.5px;
font-weight:500;
}

/* STATUS COLORS */

.ok{
color:var(--success-color,#4caf50);
}

.error{
color:var(--error-color,#f44336);
}

.warning{
color:var(--warning-color,#ff9800);
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

_getMonitoredEntities(){

const main = this._getMainSensor();
if(!main) return [];

const cfg = main.attributes.category_config || {};
const set = new Set();

Object.values(cfg).forEach(cat => {

cat.sensors?.forEach(e=>set.add(e));
cat.actuators?.forEach(e=>set.add(e));
cat.sirens?.forEach(e=>set.add(e));

});

return [...set];
}

_getStats(){

const ids=this._getMonitoredEntities();

let offline=0;
let lowBat=0;

ids.forEach(id=>{

const s=this.hass.states[id];
if(!s) return;

if(["unknown","unavailable"].includes(s.state))
offline++;

const bat=s.attributes.battery_level ?? s.attributes.battery;

if(bat!==undefined && bat<=25)
lowBat++;

});

return {offline,lowBat};
}

render(){

const main=this._getMainSensor();

const active = main?.attributes?.active_alerts?.length || 0;
const isServiceMode = main?.state === "service_mode";

const stats=this._getStats();

const score = Math.max(0,100-(active*25));

const stateText = main
? this.hass.formatEntityState(main)
: this.tt("summary.no_data");

/* STATUS - Kolory w zależności od stanu */
let stateClass = "ok";
let stateIcon = "mdi:shield-home-outline";

if(isServiceMode) {
  stateClass = "warning";
  stateIcon = "mdi:shield-off";
} else if(active>0) {
  stateClass = "error";
  stateIcon = "mdi:shield-alert-outline";
}

return html`

<div class="grid">

<ha-card outlined class="tile">

<ha-icon
icon="${stateIcon}"
class="${stateClass}">
</ha-icon>

<div class="value ${stateClass}">
${stateText}
</div>

<div class="label">
${this.tt("summary.system_status")}
</div>

</ha-card>


<ha-card outlined class="tile">

<ha-icon
icon="mdi:alert-circle-outline"
class="${active>0?"error":""}">
</ha-icon>

<div class="value ${active>0?"error":"ok"}">
${active}
</div>

<div class="label">
${this.tt("summary.active_hazards")}
</div>

</ha-card>


<ha-card outlined class="tile">

<ha-icon
icon="${stats.offline>0
?'mdi:shield-alert-outline'
:'mdi:shield-check-outline'}"
class="${stats.offline>0?"warning":"ok"}">
</ha-icon>

<div class="value ${stats.offline>0?"warning":"ok"}">
${stats.offline}
</div>

<div class="label">
${this.tt("summary.sensor_failures")}
</div>

</ha-card>


<ha-card outlined class="tile">

<ha-icon
icon="${stats.lowBat>0
?'mdi:battery-alert'
:'mdi:battery-check'}"
class="${stats.lowBat>0?"error":"ok"}">
</ha-icon>

<div class="value ${stats.lowBat>0?"error":"ok"}">
${stats.lowBat}
</div>

<div class="label">
${this.tt("summary.low_battery")}
</div>

</ha-card>


<ha-card outlined class="tile">

<ha-icon
icon="mdi:shield-check-outline"
class="${score<100
?(score<50?'error':'warning')
:'ok'}">
</ha-icon>

<div class="value ${score<100
?(score<50?'error':'warning')
:'ok'}">

${score}%

</div>

<div class="label">
${this.tt("summary.safety_score")}
</div>

</ha-card>
<ha-card outlined class="tile">

  <ha-icon
    icon="mdi:brain"
    class="${active > 0 ? 'error' : 'ok'}">
  </ha-icon>

  <div class="value ${active > 0 ? 'error' : 'ok'}">
    ${active > 0
      ? this.tt("summary.ai_detected")
      : this.tt("summary.ai_clear")}
  </div>

  <div class="label">
    ${this.tt("summary.ai_analysis")}
  </div>

</ha-card>
</div>

`;
}

}

customElements.define("summary-badges", SummaryBadges);