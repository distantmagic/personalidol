import { render } from "preact";

import { Input } from "@personalidol/framework/src/Input";

import type { VNode } from "preact";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementView as IDOMElementView } from "./DOMElementView.interface";
import type { ReplaceableStyleSheet as IReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";

let _inputStatePlaceholder: null | Int32Array = null;

export abstract class DOMElementView<U extends UserSettings> extends HTMLElement implements IDOMElementView<U> {
  public domMessagePort: null | MessagePort = null;
  public inputState: Int32Array;
  public needsRender: boolean = true;
  public props: DOMElementProps = {};
  public propsLastUpdate: number = 0;
  public rootElement: HTMLDivElement;
  public shadow: ShadowRoot;
  public styleSheet: null | IReplaceableStyleSheet = null;
  public uiMessagePort: null | MessagePort = null;
  public userSettings: null | U = null;
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

  adoptedCallback() {}

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    this.needsRender = this.viewLastUpdate < this.propsLastUpdate;
  }

  connectedCallback() {}

  disconnectedCallback() {}

  render(delta: number, elapsedTime: number, tickTimerState: TickTimerState): null | VNode<any> {
    return null;
  }

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    this.beforeRender(delta, elapsedTime, tickTimerState);

    if (this.needsRender) {
      this.needsRender = false;
      this.viewLastUpdate = tickTimerState.currentTick;
      render(this.render(delta, elapsedTime, tickTimerState), this.rootElement);
    }
  }

  updateProps(props: DOMElementProps, tickTimerState: TickTimerState): void {
    this.props = props;
    this.propsLastUpdate = tickTimerState.currentTick;
  }
}
