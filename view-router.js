import {LitElement, html} from '../@polymer/lit-element/lit-element.js';

export default class ViewRouter extends LitElement {
  _render() {
    return html`<slot></slot>`;
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

  _loadView(view, fallbackView) {
    if (view.load instanceof Function) {
      view.load().then(() => {
        this._setSelectedView(view);
      }, (loadError) => {
        this.dispatchEvent(new CustomEvent('view-load-failed', {detail: {view, error: loadError}}));
        if (fallbackView) {
          this._setSelectedView(fallbackView);
        } else {
          this._setSelectedViewToNone();
        }
      });
    } else {
      this._setSelectedView(view);
    }
  }

  _updateMatchingViews() {
    let matchingView;
    let fallbackView;
    Array.from(this.children).forEach((view) => {
      const viewPattern = view.getAttribute('pattern');
      if (!matchingView && typeof viewPattern === 'string') {
        const parameters = this._getParametersFromPattern(viewPattern);
        if (parameters) {
          matchingView = view;
          Object.keys(parameters).forEach((name) => {
            view[name] = parameters[name];
          });
        }
      } else if (!fallbackView && !viewPattern && typeof viewPattern !== 'string') {
        fallbackView = view;
      }
    });

    if (!matchingView && fallbackView) {
      matchingView = fallbackView;
    }

    if (matchingView) {
      if (matchingView.load) {
        this._loadView(matchingView, fallbackView);
      } else {
        const viewReadyListener = () => {
          matchingView.removeEventListener('view-ready', viewReadyListener);
          this._loadView(matchingView, fallbackView);
        };
        matchingView.addEventListener('view-ready', viewReadyListener);
      }
    } else {
      this._setSelectedViewToNone();
    }
  }

  _setSelectedViewToNone() {
    this.view = undefined;
    this._updateViewVisibility();
    this.dispatchEvent(new Event('view-no-match'));
  }

  _setSelectedView(view) {
    this.view = view;
    if (this.hasAttribute('update-document-title')) {
      if (view._updateDocumentTitle) {
        view._updateDocumentTitle();
      }
    }
    this._updateViewVisibility();
    this.dispatchEvent(new CustomEvent('view-changed', {detail: view}));
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
