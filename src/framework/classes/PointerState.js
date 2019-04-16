// @flow

import autoBind from "auto-bind";

import type { PointerButtonNames } from "../types/PointerButtonNames";
import type { PointerState as PointerStateInterface } from "../interfaces/PointerState";

export default class PointerState implements PointerStateInterface {
  +element: HTMLElement;

  keys: {
    [PointerButtonNames]: boolean
  };

  constructor(element: HTMLElement) {
    autoBind(this);

    this.element = element;
    this.reset();
  }

  disconnect(): void {
    this.element.removeEventListener("mousedown", this.onMouseChange);
    this.element.removeEventListener("mouseup", this.onMouseChange);
  }

  isPressed(code: PointerButtonNames): boolean {
    return !!this.keys[code];
  }

  observe(): void {
    const config = {
      capture: true,
      passive: false
    };

    this.element.addEventListener("mousedown", this.onMouseChange, config);
    this.element.addEventListener("mouseup", this.onMouseChange, config);
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
      BrowserForward: 0 !== (evt.buttons & 16)
    };
  }

  reset(): void {
    this.keys = {};
  }
}
