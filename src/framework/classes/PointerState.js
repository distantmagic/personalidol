// @flow

import autoBind from "auto-bind";

import Idempotence from "../classes/Exception/Idempotence";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { PointerButtonNames } from "../types/PointerButtonNames";
import type { PointerState as PointerStateInterface } from "../interfaces/PointerState";

export default class PointerState implements PointerStateInterface {
  #isObserving: bool;
  +element: HTMLElement;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  keys: {
    [PointerButtonNames]: boolean,
  };

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, element: HTMLElement) {
    autoBind(this);

    this.#isObserving = false;
    this.element = element;
    this.loggerBreadcrumbs = loggerBreadcrumbs;

    this.reset();
  }

  disconnect(): void {
    if (!this.#isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("disconnect"), "PointerState is not idempotent.");
    }

    this.element.removeEventListener("mousedown", this.onMouseChange);
    this.element.removeEventListener("mouseup", this.onMouseChange);

    this.#isObserving = false;
  }

  isPressed(code: PointerButtonNames): boolean {
    return !!this.keys[code];
  }

  observe(): void {
    if (this.#isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("observe"), "PointerState is not idempotent.");
    }

    const config = {
      capture: true,
      passive: false,
    };

    this.element.addEventListener("mousedown", this.onMouseChange, config);
    this.element.addEventListener("mouseup", this.onMouseChange, config);

    this.#isObserving = true;
  }

  onMouseChange(evt: MouseEvent): void {
    evt.preventDefault();

    // 0: No button or un-initialized
    // 1: Primary button (usually the left button)
    // 2: Secondary button (usually the right button)
    // 4: Auxilary button (usually the mouse wheel button or middle button)
    // 8: 4th button (typically the "Browser Back" button)
    // 16: 5th button (typically the "Browser Forward" button)
    //
    // source: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons

    if (0 === evt.buttons) {
      return void this.reset();
    }

    this.keys = {
      Primary: 0 !== (evt.buttons & 1),
      Secondary: 0 !== (evt.buttons & 2),
      Auxilary: 0 !== (evt.buttons & 4),
      BrowserBack: 0 !== (evt.buttons & 8),
      BrowserForward: 0 !== (evt.buttons & 16),
    };
  }

  reset(): void {
    this.keys = {};
  }
}
