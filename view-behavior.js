import LinkPushStateBehavior from './link-push-state-behavior.js';

export default function ViewBehavior(superclass) {
  return class extends LinkPushStateBehavior(superclass) {
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
      `;
    }

    static get properties() {
      return {
        viewTitle: {
          type: String,
          reflectToAttribute: true
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
      return new Promise((resolve) => resolve());
    }

    unloadRouters() {
      Array.from(this.root.querySelectorAll('view-router')).forEach((router) => {
        if (router._updateViewVisibility instanceof Function) {
          router.view = undefined;
          router._updateViewVisibility();
        }
      });
    }
  };
}
