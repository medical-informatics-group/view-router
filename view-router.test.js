import {ViewRouter} from './view-router';
import {LitElement, html} from 'lit-element';
import {ViewBehavior} from './view-behavior';

describe('view-router', () => {
  afterEach(() => {
    document.body.childNodes.forEach((node) => {
      document.body.removeChild(node);
    });
  });

  it('should set default values', () => {
    const router = new ViewRouter();

    expect(router.base).toEqual('/');
  });

  it('Should update document title', () => {
    class ViewComponent extends ViewBehavior(LitElement) {
      render() {
        return html`
          this is a view
        `;
      }
    }
    const router = new ViewRouter();
    const view1 = new ViewComponent();
    const view2 = new ViewComponent();

    router.appendChild(view1);
    router.appendChild(view2);
  });

  it('Should default to fallback view', () => {

  });
});
