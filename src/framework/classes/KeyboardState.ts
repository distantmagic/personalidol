import autoBind from "auto-bind";

import Idempotence from "src/framework/classes/Exception/Idempotence";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IKeyboardState } from "src/framework/interfaces/KeyboardState";

import KeyboardButtonNames from "src/framework/types/KeyboardButtonNames";

export default class KeyboardState implements HasLoggerBreadcrumbs, IKeyboardState {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  private _isObserving: boolean = false;
  private keys: {
    [key: string]: boolean;
  } = {};

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.reset();
  }

  disconnect(): void {
    if (!this._isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("disconnect"), "KeyboardState is not idempotent.");
    }

    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);

    this._isObserving = false;
  }

  isArrowPressed(): boolean {
    return this.isPressed("ArrowDown") || this.isPressed("ArrowLeft") || this.isPressed("ArrowRight") || this.isPressed("ArrowUp");
  }

  isPressed(code: KeyboardButtonNames): boolean {
    return this.keys[code];
  }

  observe(): void {
    if (this._isObserving) {
      throw new Idempotence(this.loggerBreadcrumbs.add("observe"), "KeyboardState is not idempotent.");
    }

    const config = {
      capture: true,
      passive: true,
    };

    document.addEventListener("keydown", this.onKeyDown, config);
    document.addEventListener("keyup", this.onKeyUp, config);

    this._isObserving = true;
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
