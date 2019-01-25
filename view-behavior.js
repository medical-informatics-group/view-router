import {css} from 'lit-element';
import LinkPushStateBehavior from './link-push-state-behavior.js';

export function ViewBehavior(superclass) {
  return class extends LinkPushStateBehavior(superclass) {
    static get properties() {
      return {
        viewTitle: {
          type: String,
          attribute: 'view-title',
          reflect: true
        },
        pattern: {
          type: String,
          reflect: true
        },
        visible: {
          type: Boolean,
          reflect: true
        }
      };
    }

    constructor() {
      super();
      this.visible = false;
      this.classList.add('view-router__view');
    }

    load() {
      return new Promise((resolve) => resolve());
    }

    firstUpdated() {
      if (super.firstUpdated instanceof Function) {
        super.firstUpdated();
      }
      this.dispatchEvent(new Event('view-ready'));
    }

    createRenderRoot() {
      return this;
    }
  };
}
