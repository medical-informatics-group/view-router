import {LitElement, html} from '@polymer/lit-element/lit-element.js';

import ViewBehavior from 'mig-view-router/view-behavior.js';
import './view-about-author.js';
import './view-about-authors.js';
import './view-not-found.js';

export class ViewAbout extends ViewBehavior(LitElement) {
  _render() {
    return html`
    ${html(super._render().strings)}
      <h1>${this.viewTitle}</h1>
      <p>
        This an example of the router. <a href="/">Go to the start page</a>.
        Or read more on <a href="https://example.com">example.com</a> or <a href="//example.com">example.com</a>.
      </p>
      <view-router update-document-title>
        <view-about-author pattern="/about/:authorId"></view-about-author>
        <view-about-authors pattern="/about"></view-about-authors>
        <view-not-found></view-not-found>
      </view-router>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.viewTitle = 'About';
  }
}

customElements.define('view-about', ViewAbout);
