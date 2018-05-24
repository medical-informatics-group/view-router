import { LitElement, html } from "./node_modules/@polymer/lit-element/lit-element.js";
import ViewBehavior from "./node_modules/mig-view-router/view-behavior.js";
export class ViewNotFound extends ViewBehavior(LitElement) {
  _render() {
    return html`
      ${super._render()}
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