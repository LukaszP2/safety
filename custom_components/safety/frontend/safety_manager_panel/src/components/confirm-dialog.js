import { t } from '../i18n.js';
import { LitElement, html, css } from 'lit';

export class ConfirmDialog extends LitElement {
  static properties = {
    open: { type: Boolean },
    title: { type: String },
    text: { type: String },
    icon: { type: String },
    confirmText: { type: String },
    cancelText: { type: String },
    isDanger: { type: Boolean }
  };

  constructor() {
    super();
    this.open = false;
    this.title = 'Confirmation';
    this.text = 'Are you sure you want to perform this action?';
    this.icon = 'mdi:alert-circle-outline';
    this.confirmText = 'Confirm';
    this.cancelText = 'Cancel';
    this.isDanger = false;
  }

  static styles = css`
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
    .modal-overlay.open { opacity: 1; pointer-events: auto; }
    .modal-card { background: var(--card-background-color, #1c1c1c); padding: 24px; border-radius: 12px; max-width: 450px; width: 90%; box-shadow: 0 8px 24px rgba(0,0,0,0.3); border: 1px solid var(--divider-color, #444); z-index: 1001; transform: translateY(20px); transition: transform 0.2s ease; }
    .modal-overlay.open .modal-card { transform: translateY(0); }
    .modal-title { font-size: 18px; font-weight: 500; margin-bottom: 12px; color: var(--primary-text-color); display: flex; align-items: center; gap: 8px; }
    .modal-text { font-size: 14px; color: var(--secondary-text-color); margin-bottom: 24px; line-height: 1.5; white-space: pre-wrap; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; }
    .danger-btn { --mdc-theme-primary: var(--error-color, #f44336); }
  `;

  render() {
    return html`
      <div class="modal-overlay ${this.open ? 'open' : ''}" @click=${this._handleBackdropClick}>
        <div class="modal-card" @click=${(e) => e.stopPropagation()}>
          <div class="modal-title">
            <ha-icon icon="${this.icon}" style="color: ${this.isDanger ? 'var(--error-color)' : 'var(--primary-color)'};"></ha-icon>
            ${this.title}
          </div>
          <div class="modal-text">${this.text}</div>
          <div class="modal-actions">
            <ha-button @click=${this._handleCancel}>${this.cancelText}</ha-button>
            <ha-button raised class="${this.isDanger ? 'danger-btn' : ''}" @click=${this._handleConfirm}>
              ${this.confirmText}
            </ha-button>
          </div>
        </div>
      </div>
    `;
  }

  _handleBackdropClick() { this._handleCancel(); }
  _handleCancel() { this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true })); }
  _handleConfirm() { this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true })); }
}
customElements.define('confirm-dialog', ConfirmDialog);