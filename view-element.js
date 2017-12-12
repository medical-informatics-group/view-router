import {Element as PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js';

export class ViewElement extends PolymerElement {
  static get template() {
    return `
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
    return new Promise((resolve) => {
      resolve();
    });
  }
}

customElements.define('view-element', ViewElement);
