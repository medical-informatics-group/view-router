import {LitElement, html} from 'lit-element';
import {ViewBehavior} from 'mig-view-router/view-behavior.js';

export class ViewAboutAuthor extends ViewBehavior(LitElement) {
  static get properties() {
    return Object.assign({}, super.properties, {
      authorId: {
        type: String,
        reflect: true
      },
      name: {type: String},
      content: {type: String}
    });
  }

  load() {
    return new Promise((resolve, reject) => {
      fetch('data/authors.json').then((response) => response.json()).then((data) => {
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

  render() {
    return html`
      <h1>${this.name}</h1>
      <p>${this.content}</p>
      <p><a href="/about">Show all authors</a></p>
    `;
  }
}

customElements.define('view-about-author', ViewAboutAuthor);
