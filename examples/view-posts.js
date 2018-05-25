import {LitElement, html} from '@polymer/lit-element/lit-element.js';

import ViewBehavior from 'mig-view-router/view-behavior.js';
// import get from './xhrJsonGet.js';

export class ViewPosts extends ViewBehavior(LitElement) {
  _render({posts}) {
    return html`
    ${html(super._render().strings)}
    <h1>${this.viewTitle}</h1>
    ${posts && posts.map((post) => html`<p><a href="${post.id}">${post.title}</a></p>`)}
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

  _firstRendered() {
    this.load();
  }

  connectedCallback() {
    super.connectedCallback();
    this.viewTitle = 'Latest posts';
  }

  load() {
    return new Promise((resolve, reject) => {
      fetch('posts.json').then((response) => response.json()).then((data) => {
        this.posts = data;
        resolve();
      }).catch((message) => reject(message));
    });
  }
}

customElements.define('view-posts', ViewPosts);
