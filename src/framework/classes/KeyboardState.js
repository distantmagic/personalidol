// @flow

import autoBind from "auto-bind";

import type { KeyboardButtonNames } from "../types/KeyboardButtonNames";
import type { KeyboardState as KeyboardStateInterface } from "../interfaces/KeyboardState";

export default class KeyboardState implements KeyboardStateInterface {
  keys: {
    [string]: boolean,
  };

  constructor() {
    autoBind(this);

    this.reset();
  }

  disconnect(): void {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
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
    const config = {
      capture: true,
      passive: true,
    };

    document.addEventListener("keydown", this.onKeyDown, config);
    document.addEventListener("keyup", this.onKeyUp, config);
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
