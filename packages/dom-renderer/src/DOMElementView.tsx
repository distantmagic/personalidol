import { render } from 'preact';
// import { MathUtils } from "three/src/math/MathUtils";

import type { Logger } from "loglevel";
import type { VNode } from "preact";

// import type { Nameable } from "@personalidol/framework/src/Nameable.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementView as IDOMElementView } from "./DOMElementView.interface";
import type { ReplaceableStyleSheet as IReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";

export abstract class DOMElementView extends HTMLElement implements IDOMElementView {
  public domMessagePort: null | MessagePort = null;
  public logger: null | Logger = null;
  public needsRender: boolean = true;
  public props: DOMElementProps = {};
  public propsLastUpdate: number = -1;
  public rootElement: HTMLDivElement;
  public shadow: ShadowRoot;
  public styleSheet: null | IReplaceableStyleSheet = null;
  public uiMessagePort: null | MessagePort = null;
  public viewLastUpdate: number = -1;

  private _isInitialized: boolean = false;

  constructor() {
    super();

    this.render = this.render.bind(this);

    this.shadow = this.attachShadow({
      mode: "open",
    });

    this.rootElement = document.createElement("div");
    this.shadow.appendChild(this.rootElement);
  }

  abstract beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void;

  connectedCallback() {
    this.needsRender = true;
  }

  disconnectedCallback() {
    this.needsRender = false;
    render(null, this.rootElement);
  }

  init(
    logger: Logger,
    domMessagePort: MessagePort,
    uiMessagePort: MessagePort,
  ): void {
    if (this._isInitialized) {
      throw new Error("DOM element is already initialized");
    }

    this._isInitialized = true;

    this.domMessagePort = domMessagePort;
    this.logger = logger;
    this.uiMessagePort = uiMessagePort;
  }

  render(delta: number, elapsedTime: number, tickTimerState: TickTimerState): null | VNode<any> {
    return null;
  }

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    this.beforeRender(delta, elapsedTime, tickTimerState);

    if (this.needsRender) {
      render(this.render(delta, elapsedTime, tickTimerState), this.rootElement);
      this.needsRender = false;
      this.viewLastUpdate = tickTimerState.currentTick;
    }
  }
}
