import {Element as PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js';

export class ViewRouter extends PolymerElement {
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

  constructor() {
    super();
    window.addEventListener('popstate', this._updateMatchingView.bind(this));
    setTimeout(this._updateMatchingView.bind(this), 0);
  }

  _getPathParts(path) {
    return path
      .replace(ViewRouter.stripLeftSlashPattern, '')
      .replace(ViewRouter.stripRightSlashPattern, '')
      .split(ViewRouter.splitSlashPattern);
  }

  _getParametersFromPattern(pattern) {
    const patternParts = this._getPathParts(pattern);
    const urlParts = this._getPathParts(window.location.pathname);
    const parameters = {};
    let matches = true;

    for (let i = patternParts.length - 1; i >= 0; i--) {
      if (patternParts[i].charAt(0) === ':' && urlParts[i]) {
        const name = patternParts[i].substr(1);
        parameters[name] = urlParts[i];
      } else if (patternParts[i] !== urlParts[i]) {
        matches = false;
      }
    }

    if (matches) {
      return parameters;
    }

    return undefined;
  }

  _updateMatchingView() {
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

    if (!matchingView) {
      if (fallbackView) {
        matchingView = fallbackView;
      } else {
        throw new Error(
          'Unable to find any matching view, consider adding one without a pattern as a fallback "not found" view.'
        );
      }
    }

    matchingView.load().then(() => {
      this._selectView(matchingView);
    }, () => {
      if (fallbackView) {
        this._selectView(fallbackView);
      } else {
        throw new Error(
          'Unable to find any matching view, consider adding one without a pattern as a fallback "not found" view.'
        );
      }
    });
  }

  _selectView(view) {
    this.view = view;
    if (this.updateDocumentTitle) {
      this._updateDocumentTitle();
    }
    this._updateViewVisibility();
    this.dispatchEvent(new CustomEvent('viewSelected', {detail: view}));
  }

  _updateDocumentTitle() {
    const title = document.title;
    const newTitle = title.replace(ViewRouter.titleReplacePattern, `${this.view.viewTitle}$1`);

    if (title === newTitle) {
      document.title = this.view.title;
    } else {
      document.title = newTitle;
    }
  }

  _updateViewVisibility() {
    Array.from(this.children).forEach((view) => {
      if (view === this.view) {
        view.visible = true;
      } else {
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
