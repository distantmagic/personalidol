// @flow

import Exception from "./Exception";
import PointerState from "./PointerState";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { PointerButtonNames } from "../types/PointerButtonNames";
import type { PointerState as PointerStateInterface } from "../interfaces/PointerState";

export default class PointerStateDelegate implements PointerStateInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  isObserving: boolean;
  pointerState: ?PointerStateInterface;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.pointerState = null;
  }

  disconnect(): void {
    this.isObserving = false;

    const pointerState = this.pointerState;

    if (!pointerState) {
      return;
    }

    pointerState.disconnect();
  }

  isElementAttached(): boolean {
    return !!this.pointerState;
  }

  isPressed(code: PointerButtonNames): boolean {
    const pointerState = this.pointerState;

    if (!pointerState) {
      return false;
    }

    return pointerState.isPressed(code);
  }

  observe(): void {
    this.isObserving = true;

    const pointerState = this.pointerState;

    if (!pointerState) {
      return;
    }

    pointerState.observe();
  }

  reset(): void {
    const pointerState = this.pointerState;

    if (!pointerState) {
      return;
    }

    pointerState.reset();
  }

  setElement(element: HTMLElement): void {
    if (this.isElementAttached()) {
      this.unsetElement();
    }

    this.pointerState = new PointerState(element);

    if (this.isObserving) {
      this.pointerState.observe();
    }
  }

  unsetElement(): void {
    if (!this.isElementAttached()) {
      throw new Exception(this.loggerBreadcrumbs, "Pointer state is already detached.");
    }

    this.disconnect();
    this.reset();

    this.pointerState = null;
  }
}
