import {Element as PolymerElement} from '../@polymer/polymer/polymer-element.js';

export default class ViewRouter extends PolymerElement {
  static get template() {
    return '<slot></slot>';
  }

  static get properties() {
    return {
      view: Object,
      updateDocumentTitle: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._boundUpdateMatchingViews = this._updateMatchingViews.bind(this);
    window.addEventListener('popstate', this._boundUpdateMatchingViews);
    setTimeout(this._boundUpdateMatchingViews.bind(this), 0);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this._boundUpdateMatchingViews);
  }

  _getPathParts(path) {
    return path
      .replace(ViewRouter.stripLeftSlashPattern, '')
      .replace(ViewRouter.stripRightSlashPattern, '')
      .split(ViewRouter.splitSlashPattern);
  }

  _getBasePath() {
    if (window.document.head.querySelector('base')) {
      return window.location.href.substr(window.document.baseURI.length);
    }

    return window.location.pathname.substr(1);
  }

  _getParametersFromPattern(pattern) {
    const patternParts = this._getPathParts(pattern);
    const urlParts = this._getPathParts(this._getBasePath());
    const parameters = {};
    let matches = true;

    patternParts.forEach((patternPart, index) => {
      if (patternPart.charAt(0) === ':' && urlParts[index]) {
        const name = patternPart.substr(1);
        parameters[name] = urlParts[index];
      } else if (patternPart !== urlParts[index] && patternPart !== '*') {
        matches = false;
      }
    });

    if (matches) {
      return parameters;
    }

    return undefined;
  }

  _updateMatchingViews() {
    let matchingView;
    let fallbackView;

    Array.from(this.children).forEach((view) => {
      if (!matchingView && typeof view.pattern === 'string') {
        const parameters = this._getParametersFromPattern(view.pattern);
        if (parameters) {
          matchingView = view;
          Object.keys(parameters).forEach((name) => {
            view[name] = parameters[name];
          });
        }
      } else if (!fallbackView && !view.pattern && typeof view.pattern !== 'string') {
        fallbackView = view;
      }
    });

    if (!matchingView && fallbackView) {
      matchingView = fallbackView;
    }

    if (matchingView && matchingView.load instanceof Function) {
      matchingView.load().then(() => {
        this._selectView(matchingView);
      }, () => {
        if (fallbackView) {
          this._selectView(fallbackView);
        }
      });
    }
  }

  _selectView(view) {
    this.view = view;
    if (this.updateDocumentTitle) {
      this._updateDocumentTitle();
    }
    this._updateViewVisibility();
    this.dispatchEvent(new CustomEvent('view-changed', {detail: view}));
  }

  _updateDocumentTitle() {
    const newTitle = document.title.replace(ViewRouter.titleReplacePattern, `${this.view.viewTitle}$1`);
    if (document.title === newTitle) {
      document.title = this.view.viewTitle;
    } else {
      document.title = newTitle;
    }
  }

  _updateViewVisibility() {
    Array.from(this.children).forEach((view) => {
      if (view === this.view) {
        setTimeout(() => {
          view.visible = true;
        }, 10);
      } else {
        if (view.visible && view.unload instanceof Function) {
          view.unload();
        }

        if (view.visible && view.unloadRouters instanceof Function) {
          view.unloadRouters();
        }

        view.visible = false;
      }
    });
  }
}

ViewRouter.stripLeftSlashPattern = /^[/\s]+/;
ViewRouter.stripRightSlashPattern = /[/\s]+$/;
ViewRouter.splitSlashPattern = /[/\s]+/;
ViewRouter.titleReplacePattern = /^.*?(\s*[-–]\s+[^-–]+)$/;

customElements.define('view-router', ViewRouter);
