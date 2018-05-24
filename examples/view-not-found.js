import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import {render} from './node_modules/lit-html';

import ViewBehavior from 'mig-view-router/view-behavior.js';

export class ViewNotFound extends ViewBehavior(LitElement) {
  _render() {
    return html`
    ${render(super._render(), this)}
    <h1>${this.viewTitle}</h1>
      <p>The view that you requested does not exist.</p>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.viewTitle = 'Not found';
  }
}

customElements.define('view-not-found', ViewNotFound);
