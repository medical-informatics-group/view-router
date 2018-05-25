import {html} from '@polymer/lit-element/lit-element.js';
import LinkPushStateBehavior from './link-push-state-behavior.js';

export default function ViewBehavior(superclass) {
  return class extends LinkPushStateBehavior(superclass) {
    _render() {
      if (this.visible !== this.getAttribute('visible')) {
        this._visibilityChanged(this.visible);
      }
      return html`
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

    _visibilityChanged(visible) {
      if (visible) {
        this.setAttribute('visible', '');
      } else {
        this.removeAttribute('visible');
      }
    }

    _shouldRender(props, changedProps) {
      if (props.visible && typeof changedProps.viewTitle === 'string' && changedProps.viewTitle !== document.title) {
        this._updateDocumentTitle(props.viewTitle);
      }
      return true;
    }

    _firstRendered() {
      if (super._firstRendered instanceof Function) {
        super._firstRendered();
      }
      this.dispatchEvent(new Event('view-ready'));
    }

    _updateDocumentTitle() {
      const newTitle = document.title.replace(ViewBehavior.titleReplacePattern, `${this.viewTitle}$1`);
      if (document.title === newTitle) {
        document.title = this.viewTitle;
      } else {
        document.title = newTitle;
      }
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
  };
}

ViewBehavior.titleReplacePattern = /^.*?(\s*[-–]\s+[^-–]+)$/;
