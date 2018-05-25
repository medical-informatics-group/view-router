import {html} from '@polymer/lit-element/lit-element.js';
import LinkPushStateBehavior from './link-push-state-behavior.js';

export default function ViewBehavior(superclass) {
  return class extends LinkPushStateBehavior(superclass) {
    _render() {
      if (this.visible !== this.getAttribute('visible')) {
        this._visibilityChanged(this.visible);
      }
      return html`
        <style>
          :host {
            display: none;
          }

          :host([visible]) {
            display: block;
          }
        </style>
      `;
    }

    _visibilityChanged(visible) {
      if (visible) {
        this.setAttribute('visible', '');
      } else {
        this.removeAttribute('visible');
      }
    }

    static get properties() {
      return {
        viewTitle: {
          type: String,
          reflectToAttribute: true
        },
        pattern: {
          type: String,
          reflectToAttribute: true
        },
        visible: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        }
      };
    }

    load() {
      return new Promise((resolve) => resolve());
    }
  };
}
