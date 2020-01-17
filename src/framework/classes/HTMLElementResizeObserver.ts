import ResizeObserver from "resize-observer-polyfill";

import ElementSize from "src/framework/classes/ElementSize";
import Idempotence from "src/framework/classes/Exception/Idempotence";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import Resizeable from "src/framework/interfaces/Resizeable";
import { default as IHTMLElementResizeObserver } from "src/framework/interfaces/HTMLElementResizeObserver";

export default class HTMLElementResizeObserver implements IHTMLElementResizeObserver {
  readonly element: HTMLElement;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly nativeResizeObserver: ResizeObserver;
  readonly notifiable: Set<Resizeable<"px">>;
  private _isObserving: boolean;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, element: HTMLElement) {
    const notifiable = new Set<Resizeable<"px">>();

    this._isObserving = false;
    this.element = element;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.notifiable = notifiable;
    this.nativeResizeObserver = new ResizeObserver(function(mutationList) {
      for (let mutation of mutationList) {
        const contentRect = mutation.contentRect;
        const elementSize = new ElementSize<"px">(contentRect.width, contentRect.height);

        for (let callback of notifiable.values()) {
          callback.resize(elementSize);
        }
      }
    });
  }

  disconnect(): void {
    if (!this._isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("disconnect"), "HTMLElementResizeObserver is not idempotent.");
    }

    this.nativeResizeObserver.disconnect();
    this._isObserving = false;
  }

  notify(resizeable: Resizeable<"px">): void {
    this.notifiable.add(resizeable);
  }

  observe(): void {
    if (this._isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("observe"), "HTMLElementResizeObserver is not idempotent.");
    }

    this.nativeResizeObserver.observe(this.element);
    this._isObserving = true;
  }

  off(resizeable: Resizeable<"px">): void {
    this.notifiable.delete(resizeable);
  }
}
