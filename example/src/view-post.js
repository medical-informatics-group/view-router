import {LitElement, html} from 'lit-element';
import {ViewBehavior} from 'mig-view-router/view-behavior.js';

export class ViewPost extends ViewBehavior(LitElement) {
  static get properties() {
    return Object.assign({}, super.properties, {
      id: {
        type: String,
        reflect: true
      },
      language: {
        type: String,
        reflect: true
      },
      content: {type: String}
    });
  }

  load() {
    return new Promise((resolve, reject) => {
      fetch('data/posts.json').then((response) => response.json()).then((posts) => {
        let matchingPost;
        for (const post of posts) {
          if (post.id === this.id && post.locales[this.language]) {
            matchingPost = post.locales[this.language];
            break;
          }
        }

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

  render() {
    return html`
      <h1>${this.viewTitle}</h1>
      <p>${this.content}</p>
      <p><a href="/">To latest posts</a></p>
    `;
  }
}

customElements.define('view-post', ViewPost);
