import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import {render} from './node_modules/lit-html';
import ViewBehavior from 'mig-view-router/view-behavior.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import get from './xhrJsonGet.js';

export class ViewAboutAuthors extends ViewBehavior(LitElement) {
  _render({authors}) {
    return html`
    ${render(super._render(), this)}
    ${authors && authors.map((item) => html`<p><a href="/about/${item.id}">${item.name}</a></p>`)}
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
      get('authors.json').then((response) => {
        this.authors = response.body;
        resolve();
      }, reject);
    });
  }
}

customElements.define('view-about-authors', ViewAboutAuthors);
