import {Element as PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js';
import ViewBehavior from '../view-behavior.js';
import get from './xhrJsonGet.js';

export class ViewPost extends ViewBehavior(PolymerElement) {
  static get template() {
    return `
      ${super.template}
      <h1>[[viewTitle]]</h1>
      <p>[[content]]</p>
      <p><a href="/">To latest posts</a></p>
    `;
  }

  static get properties() {
    return Object.assign({}, super.properties, {
      id: {
        type: String,
        reflectToAttribute: true
      },
      content: String
    });
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
          this.viewTitle = matchingPost.viewTitle;
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
