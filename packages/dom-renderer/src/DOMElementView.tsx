import { render } from "preact";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementRenderingContext } from "./DOMElementRenderingContext.interface";
import type { DOMElementView as IDOMElementView } from "./DOMElementView.interface";

export class DOMElementView extends HTMLElement implements IDOMElementView {
  public props: DOMElementProps = {};
  public propsLastUpdate: number = 0;
  public renderingContext: null | DOMElementRenderingContext = null;
  public rootElement: HTMLElement;
  public shadow: ShadowRoot;
  public viewLastUpdate: number = 0;

  constructor() {
    super();

    this.shadow = this.attachShadow({
      mode: "open",
    });

    this.rootElement = document.createElement("div");
    this.shadow.appendChild(this.rootElement);
  }

  connectedCallback() {
    const renderingContext = this.renderingContext;

    if (renderingContext) {
      this._beforeRender(renderingContext);
    }
  }

  disconnectedCallback() {
    render(null, this.rootElement);
  }

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    const renderingContext = this.renderingContext;

    if (!renderingContext) {
      return;
    }

    this._beforeRender(renderingContext);

    if (!renderingContext.state.needsRender) {
      return;
    }

    renderingContext.state.needsRender = false;
    this.viewLastUpdate = tickTimerState.currentTick;

    render(
      renderingContext.render(delta, elapsedTime, tickTimerState),
      this.rootElement
    );
  }

  _beforeRender(renderingContext: DOMElementRenderingContext) {
    if (renderingContext.isPure && this.propsLastUpdate < this.viewLastUpdate) {
      return;
    }

    renderingContext.beforeRender(this.props, this.propsLastUpdate, this.viewLastUpdate);
  }
}
