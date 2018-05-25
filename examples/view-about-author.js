import {LitElement, html} from '@polymer/lit-element/lit-element.js';

import ViewBehavior from 'mig-view-router/view-behavior.js';

export class ViewAboutAuthor extends ViewBehavior(LitElement) {
  _render(props) {
    return html`
    ${html(super._render().strings)}
      <h1>${props.name}</h1>
      <p>${props.content}</p>
      <p><a href="/about">Show all authors</a></p>
    `;
  }

  static get properties() {
    return Object.assign({}, super.properties, {
      authorId: {
        type: String,
        reflectToAttribute: true
      },
      name: String,
      content: String
    });
  }

  load() {
    return new Promise((resolve, reject) => {
      fetch('authors.json').then((response) => response.json()).then((data) => {
        const matchingAuthor = data.find((author) => author.id === this.authorId);

        if (matchingAuthor) {
          this.viewTitle = `About ${matchingAuthor.name}`;
          this.name = matchingAuthor.name;
          this.content = matchingAuthor.content;
          resolve();
        } else {
          reject(new Error('Not found'));
        }
      }).catch((errorMessage) => reject(errorMessage));
    });
  }

  unload() {
    this.viewTitle = 'Loading author...';
    this.name = '';
    this.content = '';
  }
}

customElements.define('view-about-author', ViewAboutAuthor);
