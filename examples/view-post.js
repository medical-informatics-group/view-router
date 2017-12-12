import {ViewElement} from '../view-element.js';
import {xhrJsonGet as get} from './xhrJsonGet.js';

export class ViewPost extends ViewElement {
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
      <p>[[content]]</p>
      <p><a href="/">To latest posts</a></p>
    `;
  }

  static get properties() {
    return {
      id: {
        type: String,
        reflectToAttribute: true
      },
      viewTitle: {
        type: String,
        reflectToAttribute: true
      },
      content: String,
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
        let matchingPost;

        response.body.forEach((post) => {
          if (post.id === this.id) {
            matchingPost = post;
          }
        });

        if (matchingPost) {
          this.title = matchingPost.title;
          this.content = matchingPost.content;
          resolve();
        } else {
          reject(new Error('Not found'));
        }
      }, reject);
    });
  }
}

customElements.define('view-post', ViewPost);
