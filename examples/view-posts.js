import '../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';
import {ViewElement} from '../view-element.js';
import {xhrJsonGet as get} from './xhrJsonGet.js';

export class ViewPosts extends ViewElement {
  static get template() {
    return `
      <style>
        :host {
          display: none;
        }

        :host([visible]) {
          display: block;
        }
      </style>
      <h1>[[viewTitle]]</h1>

      <template is="dom-repeat" items="[[posts]]">
        <p><a href="/[[item.id]]">[[item.viewTitle]]</a></p>
      </template>
    `;
  }

  static get properties() {
    return {
      viewTitle: {
        type: String,
        value: 'Latest posts',
        reflectToAttribute: true
      },
      posts: {
        type: Array,
        value: [{id: 'item3', viewTitle: 'Item 3', content: 'Hej hopp!'}]
      },
      pattern: {
        type: String,
        reflectToAttribute: true
      },
      visible: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  load() {
    return new Promise((resolve, reject) => {
      get('examples/posts.json').then((response) => {
        this.posts = response.body;
        resolve();
      }, reject);
    });
  }
}

customElements.define('view-posts', ViewPosts);
