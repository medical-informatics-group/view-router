import { LitElement, html } from "./node_modules/@polymer/lit-element/lit-element.js";
import ViewBehavior from "./node_modules/mig-view-router/view-behavior.js";
import "./node_modules/@polymer/polymer/lib/elements/dom-repeat.js";
import get from './xhrJsonGet.js';
export class ViewPosts extends ViewBehavior(LitElement) {
  _render({
    posts
  }) {
    return html`
      ${super._render()}
      <h1>${this.viewTitle}</h1>
        ${posts.map(item => html`<p><a href="/${item.id}">${item.viewTitle}</a></p>`)}
      </template>

      Also checkout the <a href="/about">about</a> page.
    `;
  }

  static get properties() {
    return Object.assign({}, super.properties, {
      posts: {
        type: Array,
        value: []
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.viewTitle = 'Latest posts';
  }

  load() {
    return new Promise((resolve, reject) => {
      get('posts.json').then(response => {
        this.posts = response.body;
        resolve();
      }, reject);
    });
  }

}
customElements.define('view-posts', ViewPosts);