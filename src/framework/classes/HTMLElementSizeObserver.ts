import ResizeObserver from "resize-observer-polyfill";

import ElementSize from "src/framework/classes/ElementSize";
import EventListenerSet from "src/framework/classes/EventListenerSet";
import Idempotence from "src/framework/classes/Exception/Idempotence";

import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as IElementSize } from "src/framework/interfaces/ElementSize";
import type { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";
import type { default as IHTMLElementSizeObserver } from "src/framework/interfaces/HTMLElementSizeObserver";

export default class HTMLElementSizeObserver implements HasLoggerBreadcrumbs, IHTMLElementSizeObserver {
  readonly element: HTMLElement;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly nativeResizeObserver: ResizeObserver;
  readonly onResize: IEventListenerSet<[IElementSize<ElementPositionUnit.Px>]>;
  private _isObserving: boolean = false;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, element: HTMLElement) {
    const onResize = new EventListenerSet(loggerBreadcrumbs.add("EventListenerSet"));

    this.element = element;
    this.onResize = onResize;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.nativeResizeObserver = new ResizeObserver(function (mutationList) {
      for (let mutation of mutationList) {
        const contentRect = mutation.contentRect;
        const elementSize = new ElementSize<ElementPositionUnit.Px>(ElementPositionUnit.Px, contentRect.width, contentRect.height);

        onResize.notify([elementSize]);
      }
    });
  }

  disconnect(): void {
    if (!this._isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("disconnect"), "HTMLElementSizeObserver is not idempotent.");
    }

    this.nativeResizeObserver.disconnect();
    this._isObserving = false;
  }

  observe(): void {
    if (this._isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("observe"), "HTMLElementSizeObserver is not idempotent.");
    }

    this.nativeResizeObserver.observe(this.element);
    this._isObserving = true;
  }
}
