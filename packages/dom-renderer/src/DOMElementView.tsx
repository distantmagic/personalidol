import { Fragment, h, render } from "preact";

import { isConstructableCSSStyleSheetSupported } from "@personalidol/support/src/isConstructableCSSStyleSheetSupported";
import { must } from "@personalidol/framework/src/must";

import { createConstructableStylesheet } from "./createConstructableStylesheet";
import { Events } from "./Events.enum";

import type { i18n } from "i18next";
import type { VNode } from "preact";

import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementView as IDOMElementView } from "./DOMElementView.interface";

export abstract class DOMElementView<U extends UserSettings> extends HTMLElement implements IDOMElementView<U> {
  public css: string = "";
  public needsRender: boolean = true;
  public shadow: ShadowRoot;
  public state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  private _domMessagePort: null | MessagePort = null;
  private _i18next: null | i18n = null;
  private _inputState: null | Int32Array = null;
  private _lastRenderedLanguage: string = "";
  private _uiMessagePort: null | MessagePort = null;
  private _userSettings: null | U = null;

  get domMessagePort(): MessagePort {
    return must(this._domMessagePort, "domMessagePort is not set but it was expected to be.");
  }

  set domMessagePort(domMessagePort: MessagePort) {
    this.needsRender = true;
    this._domMessagePort = domMessagePort;
  }

  get i18next(): i18n {
    return must(this._i18next, "i18next is not set but it was expected to be.");
  }

  set i18next(i18next: i18n) {
    this.needsRender = true;
    this._i18next = i18next;
  }

  get inputState(): Int32Array {
    return must(this._inputState, "inputState is not set but it was expected to be.");
  }

  set inputState(inputState: Int32Array) {
    this.needsRender = true;
    this._inputState = inputState;
  }

  get uiMessagePort(): MessagePort {
    return must(this._uiMessagePort, "uiMessagePort is not set but it was expected to be.");
  }

  set uiMessagePort(uiMessagePort: MessagePort) {
    this.needsRender = true;
    this._uiMessagePort = uiMessagePort;
  }

  get userSettings(): U {
    return must(this._userSettings, "userSettings is not set but it was expected to be.");
  }

  set userSettings(userSettings: U) {
    this.needsRender = true;
    this._userSettings = userSettings;
  }

  constructor() {
    super();

    this.render = this.render.bind(this);

    this.shadow = this.attachShadow({
      mode: "closed",
    });
  }

  adoptedCallback() {}

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {}

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    if (this.needsRender) {
      return;
    }

    this.needsRender = this._lastRenderedLanguage !== this.i18next.language;
  }

  connectedCallback() {
    if (isConstructableCSSStyleSheetSupported()) {
      // @ts-ignore this is a chrome-only feature at this point and as such it
      // is not typed
      this.shadow.adoptedStyleSheets = [createConstructableStylesheet(this.css)];
    }

    this.dispatchEvent(
      new CustomEvent(Events.elementConnected, {
        detail: this,
        bubbles: true,
        composed: true,
      })
    );
  }

  disconnectedCallback() {
    this.dispatchEvent(
      new CustomEvent(Events.elementDisconnected, {
        detail: this,
        bubbles: true,
        composed: true,
      })
    );
  }

  render(delta: number, elapsedTime: number, tickTimerState: TickTimerState): null | VNode<any> {
    return null;
  }

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    if (!this.isConnected) {
      return;
    }

    this.beforeRender(delta, elapsedTime, tickTimerState);

    if (!this.needsRender) {
      return;
    }

    this._lastRenderedLanguage = this.i18next.language;
    this.needsRender = false;

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
}
