import {ViewElement} from '../view-element.js';

export class ViewAbout extends ViewElement {
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
      <h1>[[viewTitle]]</h1>
      <p>This an example of the router. <a href="/">Go to the start page</a>.</p>
    `;
  }

  static get properties() {
    return {
      viewTitle: {
        type: String,
        value: 'About',
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

customElements.define('view-about', ViewAbout);
