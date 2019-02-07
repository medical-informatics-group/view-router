import {LitElement} from 'lit-element';

const startsWithSlashSpacePattern = /^[/\s]+/;
const endsWithSlashSpacePattern = /[/\s]+$/;
const endsWithSlashStarPattern = /\/\*$/;
const slashSpacePattern = /[/\s]+/g;
const titleReplacePattern = /^.*?(([-–]\s+)?[^-–]+)$/;
const urlQueryPattern = /\?.+$/;

export class ViewRouter extends LitElement {
  static get properties() {
    return {
      base: {
        type: 'String',
        reflect: true
      },
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
    this.base = '/';
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
      .replace(startsWithSlashSpacePattern, '')
      .replace(endsWithSlashSpacePattern, '')
      .split(slashSpacePattern);
  }

  _getBasePath() {
    if (window.document.head.querySelector('base')) {
      return window.location.href.substr(window.document.baseURI.length).replace(urlQueryPattern, '');
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

  _routeMatchesBase() {
    let base = this.base;
    if (typeof base === 'string') {
      if (!endsWithSlashStarPattern.test(base)) {
        base = base.replace(endsWithSlashSpacePattern, '');
        base += '/*';
      }
      const parameters = this._getParametersFromPattern(base);
      return Boolean(parameters);
    }

    return false;
  }

  _updateMatchingViews() {
    if (this._routeMatchesBase()) {
      let matchingView;
      let fallbackView;

      for (const view of this.children) {
        if (typeof view.pattern !== 'string') {
          if (!fallbackView) {
            fallbackView = view;
          }
          continue;
        }

        const viewPattern = `${this.base}/${view.pattern}`.replace(slashSpacePattern, '/');
        const parameters = this._getParametersFromPattern(viewPattern);
        if (parameters) {
          matchingView = view;
          Object.keys(parameters).forEach((name) => {
            view[name] = parameters[name];
          });
          break;
        }
      }

      if (matchingView || fallbackView) {
        this._loadView(matchingView, fallbackView);
      } else {
        this._setSelectedViewToNone();
      }
    }
  }

  _setSelectedViewToNone() {
    this.view = undefined;
    this._updateViewVisibility();
    this.dispatchEvent(new Event('view-no-match'));
  }

  _setSelectedView(view) {
    if (view !== this.view) {
      this.view = view;

      if (this.view && this.updateDocumentTitle) {
        this._updateDocumentTitle();
      }

      this._updateViewVisibility();
      this.dispatchEvent(new CustomEvent('view-changed', {detail: view}));
    }
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
