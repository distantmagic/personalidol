// @flow

import autoBind from "auto-bind";

import Idempotence from "../classes/Exception/Idempotence";

import type { KeyboardButtonNames } from "../types/KeyboardButtonNames";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { KeyboardState as KeyboardStateInterface } from "../interfaces/KeyboardState";

export default class KeyboardState implements KeyboardStateInterface {
  #isObserving: boolean;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  keys: {
    [string]: boolean,
  };

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.#isObserving = false;
    this.loggerBreadcrumbs = loggerBreadcrumbs;

    this.reset();
  }

  disconnect(): void {
    if (!this.#isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("disconnect"), "KeyboardState is not idempotent.");
    }

    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);

    this.#isObserving = false;
  }

  isArrowPressed(): boolean {
    return (
      this.isPressed("ArrowDown") ||
      this.isPressed("ArrowLeft") ||
      this.isPressed("ArrowRight") ||
      this.isPressed("ArrowUp")
    );
  }

  isPressed(code: KeyboardButtonNames): boolean {
    return !!this.keys[code];
  }

  observe(): void {
    if (this.#isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("observe"), "KeyboardState is not idempotent.");
    }

    const config = {
      capture: true,
      passive: true,
    };

    document.addEventListener("keydown", this.onKeyDown, config);
    document.addEventListener("keyup", this.onKeyUp, config);

    this.#isObserving = true;
  }

  onKeyDown(evt: KeyboardEvent): void {
    this.keys[evt.key] = true;
  }

  onKeyUp(evt: KeyboardEvent): void {
    this.keys[evt.key] = false;
  }

  reset(): void {
    this.keys = {};
  }
}
