import {LitElement, html} from 'lit-element';
import {ViewBehavior} from 'mig-view-router/view-behavior.js';
import './view-about-author.js';
import './view-about-authors.js';
import './view-not-found.js';

export class ViewAbout extends ViewBehavior(LitElement) {
  constructor() {
    super();
    this.viewTitle = 'About';
  }

  render() {
    return html`
      <h1>${this.viewTitle}</h1>
      <p>
        This an example of the router. <a href="/">Go to the start page</a>.
        Or read more on <a href="https://example.com">example.com</a> or <a href="//example.com">example.com</a>.
      </p>
      <view-router update-document-title base="/about">
        <view-about-author pattern="/:authorId"></view-about-author>
        <view-about-authors pattern="/"></view-about-authors>
        <view-not-found></view-not-found>
      </view-router>
    `;
  }
}

customElements.define('view-about', ViewAbout);
