import { LitElement, html, css } from 'lit';
import { t } from '../i18n.js';
import './entity-list-card.js';

export class NotificationChannels extends LitElement {
  static properties = {
    hass: { type: Object },
    config: { type: Object },
    isReadOnly: { type: Boolean },
    showHaNotification: { type: Boolean }
  };

  constructor() {
    super();
    this.config = {};
    this.isReadOnly = false;
    this.showHaNotification = true;
  }

  static styles = css`
    .row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--divider-color); }
    .row:last-child { border-bottom: none; padding-bottom: 0; }
    .slider-row { display: flex; align-items: center; gap: 16px; margin: 4px 0; }
    .slider-row span { font-size: 14px; font-weight: 500; min-width: 130px; color: var(--primary-text-color); }
    ha-slider { flex: 1; }
    ha-textfield { width: 100%; margin-top: 8px; }
    .nested-settings-in-card { margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--divider-color); display: flex; flex-direction: column; gap: 12px; }
    .ha-automation-card { margin-bottom: 16px; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--card-background-color); }
    .ha-automation-header { padding: 16px; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 16px; color: var(--primary-text-color); }
    .ha-automation-body { padding: 0 16px 16px 16px; }
  `;

  get _t() {
    const lang = this.hass?.locale?.language;
    return {
      haTitle: t('channels.ha_title', lang),
      haPersistent: t('channels.ha_persistent', lang),
      haPersistentDesc: t('channels.ha_persistent_desc', lang),
      pushTitle: t('channels.push_title', lang),
      pushDnd: t('channels.push_dnd', lang),
      ttsTitle: t('channels.tts_title', lang),
      volume: t('channels.volume', lang),
      ttsRepeat: t('channels.tts_repeat', lang),
      ttsInterval: t('channels.tts_interval', lang),
      sirenTitle: t('channels.siren_title', lang),
      lightTitle: t('channels.light_title', lang),
      lightEffect: t('channels.light_effect', lang),
      scriptTitle: t('channels.script_title', lang),
      scriptSkip: t('channels.script_skip', lang),
      addEntity: t('list.add_entity', lang) // NOWE Tłumaczenie do list
    };
  }

  _updateField(key, value) {
    if (this.isReadOnly) return;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { key, value }, bubbles: true, composed: true
    }));
  }

  _addEntity(key, entityId) {
    if (this.isReadOnly) return;
    const currentList = this.config[key] || [];
    if (!currentList.includes(entityId)) this._updateField(key, [...currentList, entityId]);
  }

  _removeEntity(key, entityId) {
    if (this.isReadOnly) return;
    const currentList = this.config[key] || [];
    this._updateField(key, currentList.filter(e => e !== entityId));
  }

  render() {
    const cfg = this.config || {};
    const notifyHa = cfg.notify_ha !== false;
    const tr = this._t;

    if (this.isReadOnly) {
      return html`
        <div style="display:flex; flex-direction:column; gap:8px;">
          <b>${tr.haPersistent}:</b> <entity-list-card .hass=${this.hass} .list=${cfg.notify_ha} isReadOnly></entity-list-card>
          <b>${tr.pushTitle}:</b> <entity-list-card .hass=${this.hass} .list=${cfg.notify_push} isReadOnly></entity-list-card>
          <b>${tr.ttsTitle}:</b> <entity-list-card .hass=${this.hass} .list=${cfg.notify_tts} isReadOnly></entity-list-card>
          <b>${tr.sirenTitle}:</b> <entity-list-card .hass=${this.hass} .list=${cfg.notify_sirens} isReadOnly></entity-list-card>
          <b>${tr.lightTitle}:</b> <entity-list-card .hass=${this.hass} .list=${cfg.notify_lights} isReadOnly></entity-list-card>
          <b>${tr.scriptTitle}:</b> <entity-list-card .hass=${this.hass} .list=${cfg.notify_scripts} isReadOnly></entity-list-card>
        </div>
      `;
    }

    return html`
      ${this.showHaNotification ? html`
        <div class="ha-automation-card">
          <div class="ha-automation-header">
            <ha-icon icon="mdi:bell-badge-outline" style="color: var(--primary-text-color); margin-right: 8px;"></ha-icon> ${tr.haTitle}
          </div>
          <div class="ha-automation-body">
            <div class="row" style="border-bottom: none; padding-bottom: 0;">
              <div>
                <div style="font-weight: 500; color: var(--primary-text-color);">${tr.haPersistent}</div>
                <div style="font-size: 11px; color: var(--secondary-text-color);">${tr.haPersistentDesc}</div>
              </div>
              <ha-switch .checked=${notifyHa} @change=${(e) => this._updateField('notify_ha', e.target.checked)}></ha-switch>
            </div>
          </div>
        </div>
      ` : ''}

      <entity-list-card .hass=${this.hass} title=${tr.pushTitle} icon="mdi:cellphone" .domains=${['notify', 'device_tracker']} .list=${cfg.notify_push} pickerPlaceholder=${tr.addEntity}
        @add-entity=${(e) => this._addEntity('notify_push', e.detail.entityId)} 
        @remove-entity=${(e) => this._removeEntity('notify_push', e.detail.entityId)}>
        <div class="nested-settings-in-card">
          <ha-formfield label=${tr.pushDnd}>
            <ha-switch .checked=${cfg.push_dnd !== false} @change=${(e) => this._updateField('push_dnd', e.target.checked)}></ha-switch>
          </ha-formfield>
        </div>
      </entity-list-card>

      <entity-list-card .hass=${this.hass} title=${tr.ttsTitle} icon="mdi:speaker" .domains=${['media_player']} .list=${cfg.notify_tts} pickerPlaceholder=${tr.addEntity}
        @add-entity=${(e) => this._addEntity('notify_tts', e.detail.entityId)} 
        @remove-entity=${(e) => this._removeEntity('notify_tts', e.detail.entityId)}>
        <div class="nested-settings-in-card">
          <div class="slider-row">
            <span>${tr.volume} (${cfg.tts_volume || 80}%)</span>
            <ha-slider pin min="10" max="100" step="5" .value=${cfg.tts_volume || 80} @change=${(e) => this._updateField('tts_volume', e.target.value)}></ha-slider>
          </div>
          <ha-formfield label=${tr.ttsRepeat}>
            <ha-switch .checked=${cfg.tts_repeat === true} @change=${(e) => this._updateField('tts_repeat', e.target.checked)}></ha-switch>
          </ha-formfield>
          ${cfg.tts_repeat ? html`
            <ha-textfield type="number" label=${tr.ttsInterval} .value=${cfg.tts_repeat_interval || 5} @change=${(e) => this._updateField('tts_repeat_interval', parseInt(e.target.value))}></ha-textfield>
          ` : ''}
        </div>
      </entity-list-card>

      <entity-list-card .hass=${this.hass} title=${tr.sirenTitle} icon="mdi:bullhorn" .domains=${['siren']} .list=${cfg.notify_sirens} pickerPlaceholder=${tr.addEntity}
        @add-entity=${(e) => this._addEntity('notify_sirens', e.detail.entityId)} 
        @remove-entity=${(e) => this._removeEntity('notify_sirens', e.detail.entityId)}>
      </entity-list-card>

      <entity-list-card .hass=${this.hass} title=${tr.lightTitle} icon="mdi:lightbulb" .domains=${['light']} .list=${cfg.notify_lights} pickerPlaceholder=${tr.addEntity}
        @add-entity=${(e) => this._addEntity('notify_lights', e.detail.entityId)} 
        @remove-entity=${(e) => this._removeEntity('notify_lights', e.detail.entityId)}>
        <div class="nested-settings-in-card">
          <ha-formfield label=${tr.lightEffect}>
            <ha-switch .checked=${cfg.light_effect !== false} @change=${(e) => this._updateField('light_effect', e.target.checked)}></ha-switch>
          </ha-formfield>
        </div>
      </entity-list-card>

      <entity-list-card .hass=${this.hass} title=${tr.scriptTitle} icon="mdi:script-text-outline" .domains=${['script', 'automation']} .list=${cfg.notify_scripts} pickerPlaceholder=${tr.addEntity}
        @add-entity=${(e) => this._addEntity('notify_scripts', e.detail.entityId)} 
        @remove-entity=${(e) => this._removeEntity('notify_scripts', e.detail.entityId)}>
        <div class="nested-settings-in-card">
          <ha-formfield label=${tr.scriptSkip}>
            <ha-switch .checked=${cfg.scripts_skip_conditions !== false} @change=${(e) => this._updateField('scripts_skip_conditions', e.target.checked)}></ha-switch>
          </ha-formfield>
        </div>
      </entity-list-card>
    `;
  }
}
customElements.define('notification-channels', NotificationChannels);