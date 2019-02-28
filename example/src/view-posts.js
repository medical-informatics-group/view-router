import {LitElement, html} from 'lit-element';
import {ViewBehavior} from 'mig-view-router/view-behavior.js';

export class ViewPosts extends ViewBehavior(LitElement) {
  static get properties() {
    return Object.assign({}, super.properties, {
      posts: {type: Array}
    });
  }

  constructor() {
    super();
    this.posts = [];
    this.viewTitle = 'Latest posts';
  }

  load() {
    return new Promise((resolve, reject) => {
      fetch('data/posts.json').then((response) => response.json()).then((data) => {
        this.posts = data;
        resolve();
      }).catch((message) => reject(message));
    });
  }

  render() {
    let posts = '';
    if (Array.isArray(this.posts) && this.posts.length > 0) {
      const links = [];
      for (const post of this.posts) {
        for (const [language, translation] of Object.entries(post.locales)) {
          links.push(html`<p>
            <a href="/posts/${post.id}?language=${language}">${translation.title} (${language})</a>
          </p>`);
        }
      }
      posts = html`${links}`;
    } else {
      posts = html`<p><em>No posts available</em></p>`;
    }

    return html`
      <h1>${this.viewTitle}</h1>
      ${posts}
      Also checkout the <a href="/about">about</a> page.<br>
      This is a <a href="/i-do-not-exist">broken internal link</a>.
    `;
  }
}

customElements.define('view-posts', ViewPosts);
