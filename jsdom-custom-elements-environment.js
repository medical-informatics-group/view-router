
const {installCommonGlobals} = require('jest-util');
const {JSDOM, VirtualConsole} = require('jsdom');
const JSDOMEnvironment = require('jest-environment-jsdom');
const installCE = require('document-register-element/pony');

class JSDOMCustomElementsEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);

    this.dom = new JSDOM('<!DOCTYPE html>', {
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      VirtualConsole: new VirtualConsole().sendTo(context.console || console),
      url: 'http://jsdom'
    });

    /* eslint-disable no-multi-assign */
    const global = (this.global = this.dom.window.document.defaultView);

    Object.assign(global, {
      window: this.dom.window
    });

    installCommonGlobals(global, config.globals);

    installCE(global.window, {
      type: 'force',
      noBuiltIn: false
    });
  }

  setup() {
    this._recordLogs();
  }

  teardown() {
    this.global = null;
    this.dom = null;

    this._ensureNoLogs();
    return Promise.resolve();
  }

  _recordLogs() {
    this._errorsAndLogs = [];

    const testConsole = this.dom.window.console;
    for (const [name, method] of Object.entries(testConsole)) {
      if (!['debug', 'info', 'log', 'error', 'warn'].includes(name)) {
        continue;
      }

      testConsole[name] = (...args) => { // eslint-disable-line no-loop-func, line-comment-position
        this._errorsAndLogs.push(`console.${name}: ${args.join(', ')}`);
        method.bind(testConsole)(...args);
      };
    }
  }

  _ensureNoLogs() {
    if (this._errorsAndLogs.length > 0) {
      throw new Error(`No unhandled errors or logs allowed, got:\n\n${this._errorsAndLogs.join('\n')}`);
    }
  }
}

module.exports = JSDOMCustomElementsEnvironment;
