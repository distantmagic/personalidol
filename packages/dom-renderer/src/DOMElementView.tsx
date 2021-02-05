import { render } from "preact";
// import { MathUtils } from "three/src/math/MathUtils";

import { Input } from "@personalidol/framework/src/Input";

import type { VNode } from "preact";

// import type { Nameable } from "@personalidol/framework/src/Nameable.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementView as IDOMElementView } from "./DOMElementView.interface";
import type { ReplaceableStyleSheet as IReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";

let _inputStatePlaceholder: null | Int32Array = null;

export abstract class DOMElementView extends HTMLElement implements IDOMElementView {
  public inputState: Int32Array;
  public domMessagePort: null | MessagePort = null;
  public props: DOMElementProps = {};
  public propsLastUpdate: number = 0;
  public rootElement: HTMLDivElement;
  public shadow: ShadowRoot;
  public styleSheet: null | IReplaceableStyleSheet = null;
  public uiMessagePort: null | MessagePort = null;
  public viewLastUpdate: number = 0;

  constructor() {
    super();

    if (!_inputStatePlaceholder) {
      _inputStatePlaceholder = Input.createEmptyState(false);
    }

    this.render = this.render.bind(this);
    this.updateProps = this.updateProps.bind(this);

    this.inputState = _inputStatePlaceholder;
    this.shadow = this.attachShadow({
      mode: "open",
    });

    this.rootElement = document.createElement("div");
    this.shadow.appendChild(this.rootElement);
  }

  needsRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): boolean {
    return this.viewLastUpdate < this.propsLastUpdate;
  }

  render(delta: number, elapsedTime: number, tickTimerState: TickTimerState): null | VNode<any> {
    return null;
  }

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    if (this.needsRender(delta, elapsedTime, tickTimerState)) {
      this.viewLastUpdate = tickTimerState.currentTick;
      render(this.render(delta, elapsedTime, tickTimerState), this.rootElement);
    }
  }

  updateProps(props: DOMElementProps, tickTimerState: TickTimerState): void {
    this.props = props;
    this.propsLastUpdate = tickTimerState.currentTick;
  }
}
