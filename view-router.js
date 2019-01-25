import {LitElement} from 'lit-element';

const stripLeftSlashPattern = /^[/\s]+/;
const stripRightSlashPattern = /[/\s]+$/;
const splitSlashPattern = /[/\s]+/;
const titleReplacePattern = /^.*?(([-–]\s+)?[^-–]+)$/;

export class ViewRouter extends LitElement {
  static get properties() {
    return {
      view: {type: Object},
      updateDocumentTitle: {
        type: Boolean,
        attribute: 'update-document-title',
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this.updateDocumentTitle = false;
    this.classList.add('view-router');
  }

  connectedCallback() {
    super.connectedCallback();
    this._boundUpdateMatchingViews = this._updateMatchingViews.bind(this);
    window.addEventListener('popstate', this._boundUpdateMatchingViews);
    setTimeout(this._boundUpdateMatchingViews, 0);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this._boundUpdateMatchingViews);
  }

  _getPathParts(path) {
    return path
      .replace(stripLeftSlashPattern, '')
      .replace(stripRightSlashPattern, '')
      .split(splitSlashPattern);
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
    if (view && view.load instanceof Function) {
      view.load().then(() => {
        this._setSelectedView(view);
      }).catch((loadError) => {
        this.dispatchEvent(new CustomEvent('view-load-failed', {detail: {view, error: loadError}}));
        if (fallbackView) {
          this._setSelectedView(fallbackView);
        } else {
          this._setSelectedViewToNone();
        }
      });
    } else {
      this._setSelectedView(view || fallbackView);
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

    if (matchingView || fallbackView) {
      this._loadView(matchingView, fallbackView);
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

    if (this.view && this.updateDocumentTitle) {
      this._updateDocumentTitle();
    }
    this._updateViewVisibility();
    this.dispatchEvent(new CustomEvent('view-changed', {detail: view}));
  }

  _updateDocumentTitle() {
    document.title = document.title.replace(titleReplacePattern, `${this.view.viewTitle || ''} $1`);
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

  createRenderRoot() {
    return this;
  }
}

customElements.define('view-router', ViewRouter);

document.write(`
  <style>
    .view-router .view-router__view {
      display: none;
    }

    .view-router .view-router__view[visible] {
      display: block;
    }
  </style>
`);
