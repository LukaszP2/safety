import { LitElement, html, css } from 'lit';
import { t } from '../i18n.js';

export class TabStatus extends LitElement {

  static properties = {
    hass: { type: Object }
  };

  tt(key, params) {
    return t(key, this.hass, params);
  }

  static styles = css`
    :host { display:block; padding:20px; }

    .floor-section { margin-bottom:32px; }

    .floor-title{
      font-size:18px;
      font-weight:500;
      color:var(--primary-text-color);
      margin:0 0 16px 4px;
      display:flex;
      align-items:center;
      gap:8px;
      padding-bottom:8px;
      border-bottom:1px solid var(--divider-color);
    }

    .floor-title.alert-title{
      color:var(--error-color);
      border-bottom-color:rgba(244,67,54,0.3);
    }

    .areas-grid{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
      gap:16px;
    }

    ha-card{
      display:flex;
      flex-direction:column;
      border-radius:var(--ha-card-border-radius,12px);
      transition:transform .2s ease, box-shadow .2s ease;
      height:100%;
    }

    ha-card:hover{
      transform:translateY(-2px);
      box-shadow:0 4px 8px rgba(0,0,0,.1);
    }

    .area-header{
      padding:16px;
      font-size:16px;
      font-weight:500;
      display:flex;
      justify-content:space-between;
      align-items:center;
      border-bottom:1px solid var(--divider-color);
      background-color:var(--secondary-background-color,rgba(120,120,120,.05));
    }

    .area-header.alert{
      background-color:rgba(244,67,54,.1);
      color:var(--error-color);
      border-bottom-color:rgba(244,67,54,.2);
    }

    .area-title-wrap{
      display:flex;
      align-items:center;
      gap:10px;
    }

    .entities-list{
      padding:8px 16px 16px 16px;
      display:flex;
      flex-direction:column;
      flex-grow:1;
    }

    .group-divider{
      border-bottom:1px solid var(--divider-color);
      margin:8px 0;
    }

    .entity-row{
      display:flex;
      align-items:center;
      padding:8px 0;
      cursor:pointer;
    }

    .entity-icon{
      width:32px;
      height:32px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      margin-right:12px;
      background:var(--secondary-background-color);
    }

    .entity-info{
      flex-grow:1;
      display:flex;
      flex-direction:column;
    }

    .entity-name{
      font-size:14px;
    }

    .entity-secondary{
      font-size:12px;
      color:var(--secondary-text-color);
      display:flex;
      gap:8px;
      margin-top:2px;
    }

    .entity-state{
      font-weight:500;
      font-size:14px;
      text-align:right;
    }

    .state-unavailable{ opacity:.5 }

    .badge-error{ color:var(--error-color) }
  `;

  _getMonitoredEntities() {

    const statusId = Object.keys(this.hass.states)
      .find(id => id.startsWith('sensor.') &&
      this.hass.states[id].attributes?.unique_key === 'status');

    if (!statusId) return [];

    const config = this.hass.states[statusId].attributes.category_config || {};
    const entities = new Set();

    Object.values(config).forEach(cat => {

      if (cat.sensors) cat.sensors.forEach(e => entities.add(e));
      if (cat.actuators) cat.actuators.forEach(e => entities.add(e));
      if (cat.sirens) cat.sirens.forEach(e => entities.add(e));

    });

    return Array.from(entities);
  }

  _getAreaForEntity(entId){

    const entityReg = this.hass.entities?.[entId];
    if(entityReg?.area_id) return entityReg.area_id;

    if(entityReg?.device_id){
      const device = this.hass.devices?.[entityReg.device_id];
      if(device?.area_id) return device.area_id;
    }

    return null;
  }

  _getAreasData(){

    const monitored = this._getMonitoredEntities();
    const entityMap = {};

    monitored.forEach(entId => {

      const stateObj = this.hass.states[entId];
      if(!stateObj) return;

      let areaId = this._getAreaForEntity(entId) || "unknown";

      if(!entityMap[areaId]) entityMap[areaId] = [];

      const isHazardClass = ['smoke','gas','moisture','carbon_monoxide','heat']
        .includes(stateObj.attributes.device_class);

      const isAlert = stateObj.state === "on";
      const isUnavailable = ['unavailable','unknown'].includes(stateObj.state);

      const battery = stateObj.attributes.battery_level ?? stateObj.attributes.battery;
      const isLowBattery = battery !== undefined && battery <= 25;

      const lastUpdated = new Date(stateObj.last_updated).getTime();
      const now = new Date().getTime();
      const diffHours = (now-lastUpdated)/(1000*60*60);

      const isZombie = diffHours>1 && !isUnavailable;
      const zombieDays = Math.floor(diffHours/24);

      const zombieText = isZombie
        ? this.tt("status.no_response_days",{days:zombieDays})
        : null;

      let group="ok";

      if(isAlert && isHazardClass) group="hazard";
      else if(isUnavailable) group="unavailable";
      else if(isZombie) group="zombie";
      else if(isLowBattery) group="low_battery";

      entityMap[areaId].push({
        id:entId,
        stateObj,
        group,
        battery,
        isLowBattery,
        zombieText,
        isUnavailable
      });

    });

    const processed=[];

    Object.keys(entityMap).forEach(areaId=>{

      const areaInfo =
        this.hass.areas?.[areaId] ??
        {
          area_id:"unknown",
          name:this.tt("status.unassigned_area"),
          floor_id:null
        };

      const entities = entityMap[areaId];

      const activeAlerts =
        entities.filter(e=>e.group==="hazard").length;

      processed.push({
        area:areaInfo,
        entities,
        activeAlerts
      });

    });

    return processed;
  }

  _openMoreInfo(entityId){

    this.dispatchEvent(
      new CustomEvent("hass-more-info",{
        detail:{entityId},
        bubbles:true,
        composed:true
      })
    );
  }

  _renderEntityRow(e){

    const friendlyName =
      e.stateObj.attributes.friendly_name || e.id;

    return html`

      <div
        class="entity-row ${e.isUnavailable ? "state-unavailable" : ""}"
        @click=${()=>this._openMoreInfo(e.id)}
      >

        <div class="entity-icon">
          <ha-state-icon
            .hass=${this.hass}
            .stateObj=${e.stateObj}>
          </ha-state-icon>
        </div>

        <div class="entity-info">

          <div class="entity-name">${friendlyName}</div>

          <div class="entity-secondary">

            ${e.zombieText
              ? html`<span class="badge-error">${e.zombieText}</span>`
              : ""}

            ${e.battery !== undefined
              ? html`<span class="${e.isLowBattery ? "badge-error":""}">
                ${e.battery}%
              </span>`
              : ""}

            ${e.isUnavailable
              ? html`<span class="badge-error">
                ${this.tt("status.offline")}
              </span>`
              : ""}

          </div>

        </div>

        <div class="entity-state">
          ${this.hass.formatEntityState(e.stateObj)}
        </div>

      </div>

    `;
  }

  _renderAreaCard(data){

    return html`

      <ha-card outlined>

        <div class="area-header ${data.activeAlerts>0 ? "alert":""}">

          <div class="area-title-wrap">
            <div class="area-name">${data.area.name}</div>
          </div>

          ${data.activeAlerts>0
            ? html`<ha-icon icon="mdi:shield-alert"></ha-icon>`
            : ""}

        </div>

        <div class="entities-list">

          ${data.entities.map(e=>this._renderEntityRow(e))}

        </div>

      </ha-card>

    `;
  }

  _renderFloorSection(title,areas,icon,isAlert=false){

    return html`

      <div class="floor-section">

        ${title
          ? html`
            <div class="floor-title ${isAlert?"alert-title":""}">
              <ha-icon icon="${icon}"></ha-icon>
              ${title}
            </div>
          `
          : ""}

        <div class="areas-grid">

          ${areas.map(a=>this._renderAreaCard(a))}

        </div>

      </div>

    `;
  }

  render(){

    if(!this.hass) return html``;

    const areasData = this._getAreasData();

    const alerts=[];
    const noFloor=[];

    const floorsMap={};

    if(this.hass.floors){

      Object.values(this.hass.floors).forEach(f=>{
        floorsMap[f.floor_id]={
          name:f.name,
          level:f.level || 0,
          icon:f.icon || "mdi:home",
          areas:[]
        };
      });

    }

    areasData.forEach(data=>{

      if(data.activeAlerts>0) alerts.push(data);

      else if(data.area.floor_id && floorsMap[data.area.floor_id])
        floorsMap[data.area.floor_id].areas.push(data);

      else noFloor.push(data);

    });

    const sortedFloors =
      Object.values(floorsMap)
        .filter(f=>f.areas.length>0)
        .sort((a,b)=>b.level-a.level);

    return html`

      ${alerts.length>0
        ? this._renderFloorSection("",alerts,"mdi:alert-circle-outline",true)
        : ""}

      ${sortedFloors.map(floor=>
        this._renderFloorSection(floor.name,floor.areas,floor.icon)
      )}

      ${noFloor.length>0
        ? this._renderFloorSection(
            Object.keys(floorsMap).length>0
              ? this.tt("status.other_rooms")
              : this.tt("status.rooms"),
            noFloor,
            "mdi:home-outline"
          )
        : ""}

    `;
  }

}

customElements.define("tab-status",TabStatus);