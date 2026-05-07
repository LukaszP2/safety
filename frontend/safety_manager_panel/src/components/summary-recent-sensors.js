import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';

export class SummaryRecentSensors extends HazardBase {

static properties = {
  hass: { type: Object }
};

static styles = css`

.list-item{
display:flex;
align-items:center;
padding:10px 0;
border-bottom:1px solid var(--divider-color);
}

.list-item:last-child{
border-bottom:none;
}

.item-time{
font-size:12px;
color:var(--secondary-text-color);
min-width:50px;
}

.item-name{
flex-grow:1;
margin-left:12px;
font-size:14px;
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
cursor:pointer;
}

.item-value{
font-size:14px;
font-weight:500;
}

.empty-state{
text-align:center;
color:var(--secondary-text-color);
padding:20px;
font-style:italic;
}

.icon{
color:var(--secondary-text-color);
margin-left:6px;
}

`;

_getSelectedEntities(){
  // Pobierz konfigurację kategorii z sensora statusu
  const statusId = this._getStatusSensorId();
  if(!statusId) return [];
  
  const config = this.hass.states[statusId]?.attributes?.category_config;
  if(!config) return [];
  
  const selectedEntities = [];
  
  // Zbierz sensors i actuators ze wszystkich kategorii
  ['water', 'fire', 'gas', 'temperature', 'power'].forEach(category => {
    const catConfig = config[category];
    if(!catConfig) return;
    
    if(Array.isArray(catConfig.sensors)) {
      selectedEntities.push(...catConfig.sensors);
    }
    if(Array.isArray(catConfig.actuators)) {
      selectedEntities.push(...catConfig.actuators);
    }
  });
  
  return selectedEntities;
}

_getStatusSensorId(){
  if(!this.hass) return null;
  
  return Object.keys(this.hass.states).find(id=>{
    const attrs = this.hass.states[id]?.attributes || {};
    return id.startsWith('sensor.') && attrs.unique_key === 'status';
  });
}

_getRecent(){

const selectedEntities = this._getSelectedEntities();
const activity = [];

selectedEntities.forEach(entityId => {
  const state = this.hass.states[entityId];
  
  if(!state || !state.last_changed) return;

  activity.push({
    id: entityId,
    name: state.attributes.friendly_name || entityId,
    state: this.hass.formatEntityState(state),
    last_changed: new Date(state.last_changed)
  });
});

return activity
  .sort((a,b)=>b.last_changed-a.last_changed)
  .slice(0,5);

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

const recent=this._getRecent();

return html`

<ha-card
header="${this.tt("summary.recent_activity")}">

<div class="card-content">

${recent.length>0

? recent.map(act=>html`

<div class="list-item">

<span class="item-time">

${act.last_changed.toLocaleTimeString(
[],
{hour:'2-digit',minute:'2-digit'}
)}

</span>

<ha-icon
icon="mdi:history"
class="icon">
</ha-icon>

<span
class="item-name"
@click=${()=>this._openMoreInfo(act.id)}>

${act.name}

</span>

<span class="item-value">

${act.state}

</span>

</div>

`)

: html`

<div class="empty-state">

${this.tt("summary.no_activity")}

</div>

`

}

</div>

</ha-card>

`;

}

}

customElements.define(
"summary-recent-sensors",
SummaryRecentSensors
);