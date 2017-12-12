export default function LinkPushStateBehavior(superclass) {
  const stripProtocolPattern = /^\s*\w+:\/\//;

  function isExternalUrl(url) {
    const strippedUrl = url.replace(stripProtocolPattern, '//');
    const strippedOrigin = window.location.origin.replace(stripProtocolPattern, '//');

    if (!strippedUrl.startsWith(strippedOrigin)) {
      return true;
    }
    return false;
  }

  return class extends superclass {
    constructor() {
      super();
      this._boundOnClick = this._linkClickPushStateClickHandler.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('click', this._boundOnClick);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener('click', this._boundOnClick);
    }

    _linkClickPushStateClickHandler(event) {
      const target = event.path[0];
      if (target.tagName === 'A' && !isExternalUrl(target.href)) {
        event.preventDefault();
        window.history.pushState(undefined, target.textContent, target.href);
        window.dispatchEvent(new window.PopStateEvent('popstate'));
      }
    }
  };
}
