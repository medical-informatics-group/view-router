import { LitElement, html } from "./node_modules/@polymer/lit-element/lit-element.js";
import ViewBehavior from "./node_modules/mig-view-router/view-behavior.js";
import "./node_modules/@polymer/polymer/lib/elements/dom-repeat.js";
import get from './xhrJsonGet.js';
export class ViewAboutAuthors extends ViewBehavior(LitElement) {
  _render(props) {
    return html`
      ${super._render()}
      <template is="dom-repeat" items="${props.authors}">
        <p><a href="/about/${item.id}">${item.name}</a></p>
      </template>
    `;
  }

  static get properties() {
    return Object.assign({}, super.properties, {
      authors: {
        type: Array,
        value: []
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.viewTitle = 'About';
  }

  load() {
    return new Promise((resolve, reject) => {
      get('authors.json').then(response => {
        this.authors = response.body;
        resolve();
      }, reject);
    });
  }

}
customElements.define('view-about-authors', ViewAboutAuthors);