import {LitElement, html} from 'lit-element';
import {ViewBehavior} from 'mig-view-router/view-behavior.js';

export class ViewAboutAuthors extends ViewBehavior(LitElement) {
  static get properties() {
    return Object.assign({}, super.properties, {
      authors: {type: Array}
    });
  }

  constructor() {
    super();
    this.authors = [];
    this.viewTitle = 'About';
  }

  load() {
    return new Promise((resolve, reject) => {
      fetch('data/authors.json').then((response) => response.json()).then((data) => {
        this.authors = data;
        resolve();
      }).catch(reject);
    });
  }

  render() {
    let authors = '';
    if (Array.isArray(this.authors)) {
      authors = this.authors.map((item) => html`<p><a href="/about/${item.id}">${item.name}</a></p>`);
    } else {
      authors = html`<p><em>No authors available</em></p>`;
    }

    return html`${authors}`;
  }
}

customElements.define('view-about-authors', ViewAboutAuthors);
