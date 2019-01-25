import {LitElement, html} from 'lit-element';
import {ViewBehavior} from 'mig-view-router/view-behavior.js';

export class ViewNotFound extends ViewBehavior(LitElement) {
  constructor() {
    super();
    this.viewTitle = 'Not found';
  }

  render() {
    return html`
      <h1>${this.viewTitle}</h1>
      <p>The view that you requested does not exist.</p>
    `;
  }
}

customElements.define('view-not-found', ViewNotFound);
