import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import ViewBehavior from 'mig-view-router/view-behavior.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';

export class ViewAboutAuthors extends ViewBehavior(LitElement) {
  _render({authors}) {
    return html`
    ${html(super._render().strings)}
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
      fetch('authors.json').then((response) => response.json()).then((data) => {
        this.authors = data;
        resolve();
      }).catch(reject);
    });
  }
}

customElements.define('view-about-authors', ViewAboutAuthors);
