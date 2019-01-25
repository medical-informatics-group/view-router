const PROTOCOL_PATTERN = /^\s*\w+:\/{2}/;
function isExternalURL(url) {
  const originURL = window.location.origin.replace(PROTOCOL_PATTERN, '');
  return !url.replace(PROTOCOL_PATTERN, '').startsWith(originURL);
}

export default function LinkPushStateBehavior(superclass) {
  return class extends superclass {
    constructor() {
      super();
      this._boundOnClick = this._pushStateClickHandler.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('click', this._boundOnClick);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener('click', this._boundOnClick);
    }

    _pushStateClickHandler(event) {
      const target = event.target;
      if (target.localName === 'a' && !isExternalURL(target.href)) {
        event.preventDefault();
        if (target.href !== window.location.href) {
          window.history.pushState(undefined, target.textContent, target.href);
          window.dispatchEvent(new window.PopStateEvent('popstate'));
        }
      }
    }
  };
}
