import {LitElement} from 'lit-element';
import stringify from 'json-stable-stringify';

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
    this._boundUpdateMatchingView = this._updateMatchingView.bind(this);
    window.addEventListener('popstate', this._boundUpdateMatchingView);
    setTimeout(this._boundUpdateMatchingView, 0);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this._boundUpdateMatchingView);
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
    const parameters = {};
    let matches = true;

    // Match and extract parameters from  the path
    const patternParts = this._getPathParts(pattern.replace(urlQueryPattern, ''));
    const pathParts = this._getPathParts(this._getBasePath());

    patternParts.forEach((patternPart, index) => {
      if (patternPart.charAt(0) === ':' && pathParts[index]) {
        const name = patternPart.substr(1);
        parameters[name] = pathParts[index];
      } else if (patternPart !== pathParts[index] && patternPart !== '*') {
        matches = false;
      }
    });

    // Match and extract parameters from the query string
    const queryParameters = new URLSearchParams(window.location.search);
    const patternQueryParameters = (() => {
      const parts = pattern.match(urlQueryPattern);
      if (!parts) {
        return undefined;
      }
      return new URLSearchParams(parts[0]);
    })();

    if (matches && patternQueryParameters) {
      for (const [key, patternValue] of patternQueryParameters.entries()) {
        const actualValue = queryParameters.get(key);
        if (patternValue && patternValue.charAt(0) === ':' && actualValue) {
          const name = patternValue.substr(1);
          parameters[name] = actualValue;
        } else if (patternValue && patternValue !== actualValue) {
          matches = false;
        }
      }
    }

    // If all criterias matches, return the parameters
    if (matches) {
      return parameters;
    }

    // If there pattern does not match return undefined to indicate that this pattern does not match
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

  _getViewMatches() {
    let match;
    let parameters;
    let fallback;

    for (const view of this.children) {
      if (typeof view.pattern !== 'string') {
        if (!fallback) {
          fallback = view;
        }
        continue;
      }

      if (!match) {
        const viewPattern = `${this.base}/${view.pattern}`.replace(slashSpacePattern, '/');
        const viewParameters = this._getParametersFromPattern(viewPattern);
        if (viewParameters) {
          match = view;
          parameters = viewParameters;
        }
      }
    }

    return {match, fallback, parameters};
  }

  _updateMatchingView() {
    if (!this._routeMatchesBase()) {
      return;
    }

    const matches = this._getViewMatches();
    const parametersHash = stringify(matches.parameters);

    if (this.view !== (matches.match || matches.fallback) || parametersHash !== this._lastParametersHash) {
      if (matches.match) {
        for (const [name, value] of Object.entries(matches.parameters)) {
          matches.match[name] = value;
        }
      }

      if (matches.match || matches.fallback) {
        this._loadView(matches.match, matches.fallback);
      } else {
        this._setSelectedViewToNone();
      }
      this._lastParametersHash = parametersHash;
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
