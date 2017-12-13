import {Element as PolymerElement} from './node_modules/@polymer/polymer/polymer-element.js';
import ViewBehavior from './node_modules/mig-view-router/view-behavior.js';
import './node_modules/@polymer/polymer/lib/elements/dom-repeat.js';
import get from './xhrJsonGet.js';

export class ViewPosts extends ViewBehavior(PolymerElement) {
  static get template() {
    return `
      ${super.template}
      <h1>[[viewTitle]]</h1>

      <template is="dom-repeat" items="[[posts]]">
        <p><a href="/[[item.id]]">[[item.viewTitle]]</a></p>
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
      get('posts.json').then((response) => {
        this.posts = response.body;
        resolve();
      }, reject);
    });
  }
}

customElements.define('view-posts', ViewPosts);
