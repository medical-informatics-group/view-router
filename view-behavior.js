import {html} from '@polymer/lit-element/lit-element.js';
import LinkPushStateBehavior from './link-push-state-behavior.js';

export default function ViewBehavior(superclass) {
  return class extends LinkPushStateBehavior(superclass) {
    _render() {
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
