import { Fragment, h, render } from "preact";

import { Input } from "@personalidol/framework/src/Input";

import { Events } from "./Events.enum";
import { isReplaceableStyleSheet_element } from "./isReplaceableStyleSheet_element";

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
  public shadow: ShadowRoot;
  public styleSheet: null | IReplaceableStyleSheet = null;
  public uiMessagePort: null | MessagePort = null;
  public userSettings: null | U = null;
  public userSettingsLastAcknowledgedVersion: number = 0;
  public viewLastUpdate: number = 0;

  constructor() {
    super();

    if (!_inputStatePlaceholder) {
      _inputStatePlaceholder = Input.createEmptyState(false);
    }

    this._onShadowElementConnected = this._onShadowElementConnected.bind(this);
    this._onShadowElementDisconnected = this._onShadowElementDisconnected.bind(this);
    this.render = this.render.bind(this);
    this.updateProps = this.updateProps.bind(this);

    this.inputState = _inputStatePlaceholder;
    this.shadow = this.attachShadow({
      mode: "open",
    });
  }

  adoptedCallback() {}

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    this.needsRender = this.viewLastUpdate < this.propsLastUpdate;

    const userSettings = this.userSettings;

    if (!userSettings || this.needsRender) {
      return;
    }

    this.needsRender = this.userSettingsLastAcknowledgedVersion < userSettings.version;
    this.userSettingsLastAcknowledgedVersion = userSettings.version;
  }

  connectedCallback() {
    this.shadow.addEventListener(Events.elementConnected, this._onShadowElementConnected);
    this.shadow.addEventListener(Events.elementDisconnected, this._onShadowElementDisconnected);
    this.dispatchEvent(
      new CustomEvent(Events.elementConnected, {
        detail: this,
        bubbles: true,
      })
    );
  }

  disconnectedCallback() {
    this.shadow.removeEventListener(Events.elementConnected, this._onShadowElementConnected);
    this.shadow.removeEventListener(Events.elementDisconnected, this._onShadowElementDisconnected);
    this.dispatchEvent(
      new CustomEvent(Events.elementDisconnected, {
        detail: this,
        bubbles: true,
      })
    );
  }

  render(delta: number, elapsedTime: number, tickTimerState: TickTimerState): null | VNode<any> {
    return null;
  }

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    this.beforeRender(delta, elapsedTime, tickTimerState);

    if (!this.needsRender) {
      return;
    }

    this.needsRender = false;
    this.viewLastUpdate = tickTimerState.currentTick;

    const renderedElements = this.render(delta, elapsedTime, tickTimerState);
    const styleSheet = this.styleSheet;

    if (!styleSheet || !isReplaceableStyleSheet_element(styleSheet)) {
      render(renderedElements, this.shadow);
      return;
    }

    render(
      <Fragment>
        <style>{styleSheet.css}</style>
        {renderedElements}
      </Fragment>,
      this.shadow
    );
  }

  updateProps(props: DOMElementProps, tickTimerState: TickTimerState): void {
    this.props = props;
    this.propsLastUpdate = tickTimerState.currentTick;
  }

  private _onShadowElementConnected(evt: any) {
    this.dispatchEvent(
      new CustomEvent(Events.elementConnected, {
        detail: evt.detail,
        bubbles: true,
      })
    );
  }

  private _onShadowElementDisconnected(evt: any) {
    this.dispatchEvent(
      new CustomEvent(Events.elementDisconnected, {
        detail: evt.detail,
        bubbles: true,
      })
    );
  }
}
