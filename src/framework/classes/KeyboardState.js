// @flow

import autoBind from "auto-bind";

import type { KeyboardKeyNames } from "../types/KeyboardKeyNames";
import type { KeyboardState as KeyboardStateInterface } from "../interfaces/KeyboardState";

export default class KeyboardState implements KeyboardStateInterface {
  +keys: {
    [string]: boolean
  };

  constructor() {
    autoBind(this);

    this.keys = {};
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

  isPressed(code: KeyboardKeyNames): boolean {
    return !!this.keys[code];
  }

  observe(): void {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  onKeyDown(evt: KeyboardEvent) {
    this.keys[evt.key] = true;
  }

  onKeyUp(evt: KeyboardEvent) {
    this.keys[evt.key] = false;
  }
}
