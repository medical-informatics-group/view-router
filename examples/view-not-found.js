import {ViewElement} from '../view-element.js';

export class ViewNotFound extends ViewElement {
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
      <h1>[[title]]</h1>
      <p>The view that you requested does not exist.</p>
    `;
  }

  static get properties() {
    return {
      title: {
        type: String,
        value: 'Not found',
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
}

customElements.define('view-not-found', ViewNotFound);
