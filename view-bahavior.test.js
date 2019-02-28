import {ViewBehavior} from './view-behavior';
import {LitElement} from 'lit-element';

describe('view-behavior', () => {
  it('Should set default values', () => {
    class TestComponent extends LitElement {}

    customElements.define('test-component', TestComponent);

    const view = new ViewBehavior(TestComponent);

    expect(view.visible).toBeFalsy();
  });
});
