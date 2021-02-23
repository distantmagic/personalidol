import { Fragment, h, render } from "preact";

import { isConstructableCSSStyleSheetSupported } from "@personalidol/support/src/isConstructableCSSStyleSheetSupported";
import { must } from "@personalidol/framework/src/must";

import { createConstructableStylesheet } from "./createConstructableStylesheet";
import { Events } from "./Events.enum";

import type { VNode } from "preact";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementView as IDOMElementView } from "./DOMElementView.interface";

export abstract class DOMElementView<U extends UserSettings> extends HTMLElement implements IDOMElementView<U> {
  public css: string = "";
  public needsRender: boolean = true;
  public props: DOMElementProps = {};
  public propsLastUpdate: number = 0;
  public shadow: ShadowRoot;
  public userSettingsLastAcknowledgedVersion: number = -1;
  public viewLastUpdate: number = 0;

  private _domMessagePort: null | MessagePort = null;
  private _inputState: null | Int32Array = null;
  private _uiMessagePort: null | MessagePort = null;
  private _userSettings: null | U = null;

  get domMessagePort(): MessagePort {
    return must(this._domMessagePort, "domMessagePort is not set but it was expected to be.");
  }

  set domMessagePort(domMessagePort: MessagePort) {
    this._domMessagePort = domMessagePort;
  }

  get inputState(): Int32Array {
    return must(this._inputState, "inputState is not set but it was expected to be.");
  }

  set inputState(inputState: Int32Array) {
    this._inputState = inputState;
  }

  get uiMessagePort(): MessagePort {
    return must(this._uiMessagePort, "uiMessagePort is not set but it was expected to be.");
  }

  set uiMessagePort(uiMessagePort: MessagePort) {
    this._uiMessagePort = uiMessagePort;
  }

  get userSettings(): U {
    return must(this._userSettings, "userSettings is not set but it was expected to be.");
  }

  set userSettings(userSettings: U) {
    this._userSettings = userSettings;
  }

  constructor() {
    super();

    this._onShadowElementConnected = this._onShadowElementConnected.bind(this);
    this._onShadowElementDisconnected = this._onShadowElementDisconnected.bind(this);
    this.render = this.render.bind(this);
    this.updateProps = this.updateProps.bind(this);

    this.shadow = this.attachShadow({
      mode: "open",
    });
  }

  adoptedCallback() {}

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    if (this.needsRender) {
      return;
    }

    this.needsRender = this.viewLastUpdate < this.propsLastUpdate;

    if (this.needsRender) {
      return;
    }

    const userSettings = this.userSettings;

    if (!userSettings) {
      return;
    }

    this.needsRender = this.userSettingsLastAcknowledgedVersion < userSettings.version;
    this.userSettingsLastAcknowledgedVersion = userSettings.version;
  }

  connectedCallback() {
    if (isConstructableCSSStyleSheetSupported()) {
      // @ts-ignore
      this.shadow.adoptedStyleSheets = [createConstructableStylesheet(this.css)];
    }

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

    if (!this.css || isConstructableCSSStyleSheetSupported()) {
      render(renderedElements, this.shadow);
      return;
    }

    render(
      <Fragment>
        <style>{this.css}</style>
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
