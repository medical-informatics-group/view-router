import {Element as PolymerElement} from './node_modules/@polymer/polymer/polymer-element.js';
import ViewBehavior from './node_modules/mig-view-router/view-behavior.js';

export class ViewNotFound extends ViewBehavior(PolymerElement) {
  static get template() {
    return `
      ${super.template}
      <h1>[[viewTitle]]</h1>
      <p>The view that you requested does not exist.</p>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.viewTitle = 'Not found';
  }
}

customElements.define('view-not-found', ViewNotFound);
