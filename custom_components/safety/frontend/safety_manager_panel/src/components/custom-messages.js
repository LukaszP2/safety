import { html, css } from 'lit';
import { HazardBase } from '../hazard-base.js';

export class CustomMessages extends HazardBase {

  static properties = {
    hass: { type: Object },
    config: { type: Object },
    isReadOnly: { type: Boolean },
    titleKey: { type: String },
    msgKey: { type: String }
  };

  constructor() {
    super();
    this.config = {};
    this.isReadOnly = false;
    this.titleKey = 'default_title';
    this.msgKey = 'default_msg';
  }

  _ha(key, fallback) {
    return this.hass?.localize?.(key) || fallback;
  }

  static styles = css`

    ha-textfield {
      width: 100%;
      margin-top: 8px;
    }

    .tag-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .tag-label {
      font-size: 11px;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-right: 4px;
    }

    .tag-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      color: var(--primary-text-color);
      transition: all 0.2s ease;
      user-select: none;
    }

    .tag-chip:hover {
      border-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color,3,169,244),0.1);
    }

    .tag-chip ha-icon {
      --mdc-icon-size: 16px;
      color: var(--primary-color);
      pointer-events: none;
    }

    .preview-box {
      margin-top: 12px;
      padding: 12px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      font-size: 13px;
    }

    .preview-title {
      font-weight: 600;
      margin-bottom: 6px;
    }

    .preview-msg {
      color: var(--secondary-text-color);
    }
  `;

  _updateField(key, value) {

    if (this.isReadOnly) return;

    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { key, value },
      bubbles: true,
      composed: true
    }));
  }

  _insertTag(fieldId, tag, keyToUpdate) {

    if (this.isReadOnly) return;

    const field = this.shadowRoot.querySelector(`#${fieldId}`);
    const currentValue = this.config[keyToUpdate] || '';

    let start = currentValue.length;
    let end = currentValue.length;

    if (field) {

      const input =
        field.shadowRoot
          ? field.shadowRoot.querySelector('input, textarea') || field
          : field;

      if (input && typeof input.selectionStart === 'number') {
        start = input.selectionStart;
        end = input.selectionEnd;
      }
    }

    let prefix =
      (start > 0 && currentValue.charAt(start - 1) !== ' ') ? ' ' : '';

    const newValue =
      currentValue.substring(0, start) +
      prefix +
      tag +
      currentValue.substring(end);

    this._updateField(keyToUpdate, newValue);
  }

  _generatePreview(text) {

    if (!text) return "";

    const replacements = {
      "{{sensor_name}}": this.tt('messages.sensor'),
      "{{sensor_area}}": this.tt('messages.area'),
      "{{device_name}}": this.tt('messages.device'),
      "{{time}}": new Date().toLocaleTimeString()
    };

    let result = text;

    Object.entries(replacements).forEach(([tag, value]) => {
      result = result.replaceAll(tag, value);
    });

    return result;
  }

  render() {

    const cfg = this.config || {};

    const titleLabel =
      this._ha(
        "ui.panel.config.automation.editor.actions.notify.title",
        this.tt('messages.title')
      );

    const msgLabel =
      this._ha(
        "ui.panel.config.automation.editor.actions.notify.message",
        this.tt('messages.message')
      );

    if (this.isReadOnly) {
      return html`

        <ha-textfield
          disabled
          label="${titleLabel}"
          .value=${cfg[this.titleKey] || ''}
        ></ha-textfield>

        <ha-textfield
          disabled
          label="${msgLabel}"
          .value=${cfg[this.msgKey] || ''}
        ></ha-textfield>

      `;
    }

    return html`

      <ha-textfield
        id="title_field"
        label="${titleLabel}"
        .value=${cfg[this.titleKey] || ''}
        @input=${e => this._updateField(this.titleKey, e.target.value)}
      ></ha-textfield>

      <div class="tag-row">

        <span class="tag-label">${this.tt('messages.insert')}</span>

        <div class="tag-chip"
          @mousedown=${e => {
            e.preventDefault();
            this._insertTag('title_field','{{sensor_name}}',this.titleKey);
          }}>
          <ha-icon icon="mdi:radar"></ha-icon>
          ${this.tt('messages.sensor')}
        </div>

        <div class="tag-chip"
          @mousedown=${e => {
            e.preventDefault();
            this._insertTag('title_field','{{sensor_area}}',this.titleKey);
          }}>
          <ha-icon icon="mdi:view-dashboard"></ha-icon>
          ${this.tt('messages.area')}
        </div>

        <div class="tag-chip"
          @mousedown=${e => {
            e.preventDefault();
            this._insertTag('title_field','{{device_name}}',this.titleKey);
          }}>
          <ha-icon icon="mdi:valve"></ha-icon>
          ${this.tt('messages.device')}
        </div>

        <div class="tag-chip"
          @mousedown=${e => {
            e.preventDefault();
            this._insertTag('title_field','{{time}}',this.titleKey);
          }}>
          <ha-icon icon="mdi:clock-alert-outline"></ha-icon>
          ${this.tt('messages.time')}
        </div>

      </div>

      <ha-textfield
        id="msg_field"
        label="${msgLabel}"
        .value=${cfg[this.msgKey] || ''}
        @input=${e => this._updateField(this.msgKey, e.target.value)}
      ></ha-textfield>

      <div class="tag-row">

        <span class="tag-label">${this.tt('messages.insert')}</span>

        <div class="tag-chip"
          @mousedown=${e => {
            e.preventDefault();
            this._insertTag('msg_field','{{sensor_name}}',this.msgKey);
          }}>
          <ha-icon icon="mdi:radar"></ha-icon>
          ${this.tt('messages.sensor')}
        </div>

        <div class="tag-chip"
          @mousedown=${e => {
            e.preventDefault();
            this._insertTag('msg_field','{{sensor_area}}',this.msgKey);
          }}>
          <ha-icon icon="mdi:view-dashboard"></ha-icon>
          ${this.tt('messages.area')}
        </div>

        <div class="tag-chip"
          @mousedown=${e => {
            e.preventDefault();
            this._insertTag('msg_field','{{device_name}}',this.msgKey);
          }}>
          <ha-icon icon="mdi:valve"></ha-icon>
          ${this.tt('messages.device')}
        </div>

        <div class="tag-chip"
          @mousedown=${e => {
            e.preventDefault();
            this._insertTag('msg_field','{{time}}',this.msgKey);
          }}>
          <ha-icon icon="mdi:clock-alert-outline"></ha-icon>
          ${this.tt('messages.time')}
        </div>

      </div>

      <div class="preview-box">

        <div class="preview-title">
          ${this.tt('messages.preview')}
        </div>

        <div class="preview-title">
          ${this._generatePreview(cfg[this.titleKey] || '')}
        </div>

        <div class="preview-msg">
          ${this._generatePreview(cfg[this.msgKey] || '')}
        </div>

      </div>

    `;
  }
}

customElements.define('custom-messages', CustomMessages);