import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';

import './matrix-table.js';
import './entity-list-card.js';
import './notification-channels.js';
import './custom-messages.js';

export class TabHazards extends HazardBase {

static properties = {
  hass: { type: Object },
  _activeTab: { type: Number, state: true },
  _localConfig: { state: true }
};

constructor() {
  super();

  this._activeTab = 0;
  this._localConfig = {};

  this.categories = [
    { id: 'water', icon: 'mdi:water' },
    { id: 'fire', icon: 'mdi:fire' },
    { id: 'gas', icon: 'mdi:gas-cylinder' },
    { id: 'temperature', icon: 'mdi:thermometer' },
    { id: 'power', icon: 'mdi:power-plug' }
  ];
}

static styles = css`
:host{display:block;padding:20px}

ha-card{
border-radius:12px;
margin-bottom:24px;
overflow:visible!important;
}

.card-content{
padding:16px;
display:flex;
flex-direction:column;
gap:16px;
}

.card-header-custom{
display:flex;
justify-content:space-between;
align-items:center;
padding:16px 16px 0 16px;
}

.card-header-title{
font-size:20px;
display:flex;
align-items:center;
gap:12px;
color:var(--primary-text-color);
}

.card-header-icon{
color:var(--primary-color);
--mdc-icon-size:26px;
}

.tabs-container{
display:flex;
gap:8px;
overflow-x:auto;
padding:4px;
margin-bottom:24px;
border-bottom:1px solid var(--divider-color);
}

.tab-item{
display:flex;
align-items:center;
gap:8px;
padding:12px 16px;
cursor:pointer;
color:var(--secondary-text-color);
border-bottom:2px solid transparent;
font-weight:500;
white-space:nowrap;
}

.tab-item.active{
color:var(--primary-color);
border-bottom-color:var(--primary-color);
}

.bottom-actions{
display:flex;
justify-content:flex-end;
gap:12px;
margin-top:24px;
padding:16px;
background:var(--card-background-color);
border-radius:12px;
border:1px solid var(--divider-color);
}

.btn-test{--mdc-theme-primary:var(--error-color)}
.btn-test-notify{--mdc-theme-primary:var(--warning-color)}
.btn-dismiss{--mdc-theme-primary:var(--success-color)}
`;

willUpdate(changed){

if(changed.has("hass")){

const statusId=this._getEntity("sensor","status");

if(!statusId) return;

const cfg=this.hass.states[statusId]?.attributes?.category_config;

if(cfg){
this._localConfig=structuredClone(cfg);
}

}

}

_getEntity(domain,uniqueKey){

if(!this.hass) return null;

return Object.keys(this.hass.states).find(id=>{
const attrs=this.hass.states[id]?.attributes||{};
return id.startsWith(`${domain}.`) && attrs.unique_key===uniqueKey;
});

}

_updateSetting(cat,key,value){

this.hass.callService("safety","update_settings",{
category:cat,
key:key,
value:value
});

}

_updateChannel(cat, key, value) {

if (!this._localConfig) return;

this._localConfig = {
  ...this._localConfig,
  [cat]: {
    ...this._localConfig[cat],
    [key]: value
  }
};

this.requestUpdate();

/* zapis backend */
this._updateSetting(cat, key, value);

}

_addEntity(cat,key,entity){

const list=this._localConfig?.[cat]?.[key]||[];

if(list.includes(entity)) return;

const updated=[...list,entity];

this._localConfig={
...this._localConfig,
[cat]:{
...this._localConfig[cat],
[key]:updated
}
};

this.requestUpdate();

this._updateSetting(cat,key,updated);

}

_removeEntity(cat,key,entity){

const list=this._localConfig?.[cat]?.[key]||[];

const updated=list.filter(e=>e!==entity);

this._localConfig={
...this._localConfig,
[cat]:{
...this._localConfig[cat],
[key]:updated
}
};

this.requestUpdate();

this._updateSetting(cat,key,updated);

}

 render(){

 const tr={
 sensorsTitle:this.tt("hazards.sensors")||"Sensors",
 actuatorsTitle:this.tt("hazards.actuators")||"Actuators",
 sensorsCardTitle:this.tt("hazards.sensors_card")||"Detection Sensors",
 actuatorsCardTitle:this.tt("hazards.actuators_card")||"Execution Devices",
 addEntity:this.tt("list.add_entity")||"Add entity...",
 matrixTitle:this.tt("hazards.matrix")||"Home Modes Matrix",
 channelsTitle:this.tt("hazards.channels")||"Notification Channels",
 messagesTitle:this.tt("hazards.messages")||"Messages",
 testNotify:this.tt("hazards.test_notify")||"Test Notifications",
 testAlarm:this.tt("hazards.test_alarm")||"Simulate Alarm",
 dismiss:this.tt("hazards.dismiss")||"Dismiss Alarm"
 };

 const activeCat=this.categories[this._activeTab].id;

 const allConfig=this._localConfig||{};
 const globalCfg=allConfig.global||{};
 const cfg=allConfig[activeCat]||{};

 const showModes=globalCfg.use_home_modes===true;
 const autoConfigSensors=globalCfg.auto_config_sensors===true;
 const autoConfigActuators=globalCfg.auto_config_actuators===true;

return html`

<div class="tabs-container">

${this.categories.map((c,i)=>html`

<div
class="tab-item ${this._activeTab===i?'active':''}"
@click=${()=>this._activeTab=i}>

<ha-icon icon="${c.icon}"></ha-icon>
${this.tt(`hazards.categories.${c.id}`)}

</div>

`)}

</div>

<ha-card>

<div class="card-header-custom">
<div class="card-header-title">
<ha-icon icon="mdi:radar" class="card-header-icon"></ha-icon>
${tr.sensorsTitle}
</div>
</div>

<div class="card-content">

 <entity-list-card
 .hass=${this.hass}
 .category=${activeCat}
 title=${tr.sensorsCardTitle}
 icon="mdi:eye-outline"
 .domains=${["binary_sensor","sensor"]}
 .list=${cfg.sensors}
 pickerPlaceholder=${tr.addEntity}
 .isReadOnly=${autoConfigSensors}
 @add-entity=${e=>!autoConfigSensors&&this._addEntity(activeCat,"sensors",e.detail.entityId)}
 @remove-entity=${e=>!autoConfigSensors&&this._removeEntity(activeCat,"sensors",e.detail.entityId)}
 ></entity-list-card>

</div>

</ha-card>

${showModes?html`

<ha-card>

<div class="card-header-custom">
<div class="card-header-title">
<ha-icon icon="mdi:home-account" class="card-header-icon"></ha-icon>
${tr.matrixTitle}
</div>
</div>

<div class="card-content">

<matrix-table
.matrix=${cfg.mode_matrix}
@matrix-change=${e=>this._updateSetting(activeCat,"mode_matrix",e.detail.matrix)}
></matrix-table>

</div>

</ha-card>

`:''}

<ha-card>

<div class="card-header-custom">
<div class="card-header-title">
<ha-icon icon="mdi:valve" class="card-header-icon"></ha-icon>
${tr.actuatorsTitle}
</div>
</div>

<div class="card-content">

 <entity-list-card
 .hass=${this.hass}
 .category=${activeCat}
 title=${tr.actuatorsCardTitle}
 icon="mdi:power-plug"
 .domains=${["switch","valve","cover","button"]}
 .list=${cfg.actuators}
 pickerPlaceholder=${tr.addEntity}
 .isReadOnly=${autoConfigActuators}
 @add-entity=${e=>!autoConfigActuators&&this._addEntity(activeCat,"actuators",e.detail.entityId)}
 @remove-entity=${e=>!autoConfigActuators&&this._removeEntity(activeCat,"actuators",e.detail.entityId)}
 ></entity-list-card>

</div>

</ha-card>

<ha-card>

<div class="card-header-custom">
<div class="card-header-title">
<ha-icon icon="mdi:bell-ring" class="card-header-icon"></ha-icon>
${tr.channelsTitle}
</div>
</div>

<div class="card-content">

<notification-channels
.hass=${this.hass}
.config=${cfg}
@config-changed=${e =>
  this._updateChannel(activeCat, e.detail.key, e.detail.value)
}
></notification-channels>

</div>

</ha-card>

<ha-card>

<div class="card-header-custom">
<div class="card-header-title">
<ha-icon icon="mdi:message-alert" class="card-header-icon"></ha-icon>
${tr.messagesTitle}
</div>
</div>

<div class="card-content">

<custom-messages
.hass=${this.hass}
.config=${cfg}
titleKey="custom_title"
msgKey="custom_msg"
@config-changed=${e =>
  this._updateChannel(activeCat, e.detail.key, e.detail.value)
}
></custom-messages>

</div>

</ha-card>

<div class="bottom-actions">

<ha-button raised class="btn-test-notify"
@click=${()=>this.hass.callService("safety","test_alert",{category:activeCat,execute_actions:false})}>
${tr.testNotify}
</ha-button>

<ha-button raised class="btn-test"
@click=${()=>this.hass.callService("safety","test_alert",{category:activeCat,execute_actions:true})}>
${tr.testAlarm}
</ha-button>

<ha-button raised class="btn-dismiss"
@click=${()=>this.hass.callService("safety","dismiss_alert",{category:activeCat})}>
${tr.dismiss}
</ha-button>

</div>

`;

}

}

customElements.define("tab-hazards",TabHazards);