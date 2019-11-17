// @flow

import ResizeObserver from "resize-observer-polyfill";

import ElementSize from "../classes/ElementSize";
import Idempotence from "../classes/Exception/Idempotence";

import type { HTMLElementResizeObserver as HTMLElementResizeObserverInterface } from "../interfaces/HTMLElementResizeObserver";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Resizeable } from "../interfaces/Resizeable";

export default class HTMLElementResizeObserver implements HTMLElementResizeObserverInterface {
  #isObserving: boolean;
  +element: HTMLElement;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +nativeResizeObserver: ResizeObserver;
  +notifiable: Set<Resizeable<"px">>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, element: HTMLElement) {
    const notifiable = new Set<Resizeable<"px">>();

    this.#isObserving = false;
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
    if (!this.#isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("disconnect"), "HTMLElementResizeObserver is not idempotent.");
    }

    this.nativeResizeObserver.disconnect();
    this.#isObserving = false;
  }

  notify(resizeable: Resizeable<"px">): void {
    this.notifiable.add(resizeable);
  }

  observe(): void {
    if (this.#isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("observe"), "HTMLElementResizeObserver is not idempotent.");
    }

    this.nativeResizeObserver.observe(this.element);
    this.#isObserving = true;
  }

  off(resizeable: Resizeable<"px">): void {
    this.notifiable.delete(resizeable);
  }
}
