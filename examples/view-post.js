import {LitElement, html} from './node_modules/@polymer/lit-element/lit-element.js';
import ViewBehavior from './node_modules/mig-view-router/view-behavior.js';

export class ViewPost extends ViewBehavior(LitElement) {
  _render() {
    return html`
    ${html(super._render().strings)}
    <h1>${this.viewTitle}</h1>
    <p>${this.content}</p>
    <p><a href="/">To latest posts</a></p>
    `;
  }

  static get properties() {
    return Object.assign({}, super.properties, {
      postId: {
        type: String,
        reflectToAttribute: true
      },
      content: String
    });
  }

  load() {
    return new Promise((resolve, reject) => {
      fetch('posts.json').then((response) => response.json()).then((data) => {
        const matchingPost = data.find((post) => post.id === this.postId);
        if (matchingPost) {
          this.viewTitle = matchingPost.title;
          this.content = matchingPost.content;
          resolve();
        } else {
          reject(new Error('Not found'));
        }
      }, reject);
    });
  }

  unload() {
    this.viewTitle = 'Loading post...';
    this.content = '';
  }
}

customElements.define('view-post', ViewPost);
