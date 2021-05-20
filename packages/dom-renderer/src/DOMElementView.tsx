import { Fragment, h, render } from "preact";

import { createConstructableStylesheet } from "@personalidol/dom/src/createConstructableStylesheet";
import { isConstructableCSSStyleSheetSupported } from "@personalidol/framework/src/isConstructableCSSStyleSheetSupported";
import { must } from "@personalidol/framework/src/must";

import { Events } from "./Events.enum";

import type { i18n, TOptions } from "i18next";
import type { VNode } from "preact";

import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementView as IDOMElementView } from "./DOMElementView.interface";
import type { DOMElementViewContext } from "./DOMElementViewContext.type";

export class DOMElementView<C extends DOMElementViewContext> extends HTMLElement implements IDOMElementView<C> {
  public css: string = "";
  public lastRenderedLanguage: string = "";
  public needsRender: boolean = true;
  public shadow: ShadowRoot;
  public version: number = -1;
  public state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  private _context: null | C = null;
  private _domMessagePort: null | MessagePort = null;
  private _i18next: null | i18n = null;

  get context(): C {
    return must(this._context, "context is not set but it was expected to be.");
  }

  set context(context: C) {
    this.needsRender = true;
    this._context = context;
  }

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

  constructor() {
    super();

    this.render = this.render.bind(this);
    this.t = this.t.bind(this);

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

    this.needsRender = this.lastRenderedLanguage !== this.i18next.language;
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

  t(key: string, options?: string | TOptions<object>): string {
    return this.i18next.t(key, options);
  }

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    if (!this.isConnected) {
      return;
    }

    this.beforeRender(delta, elapsedTime, tickTimerState);

    if (!this.needsRender) {
      return;
    }

    this.lastRenderedLanguage = this.i18next.language;
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
