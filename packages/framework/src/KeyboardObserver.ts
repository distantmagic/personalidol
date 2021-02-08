import { MathUtils } from "three/src/math/MathUtils";

// import { InputIndices } from "./InputIndices.enum";
// import { passiveEventListener } from "./passiveEventListener";

import type { KeyboardObserver as IKeyboardObserver } from "./KeyboardObserver.interface";
import type { TickTimerState } from "./TickTimerState.type";

export function KeyboardObserver(htmlElement: HTMLElement, inputState: Int32Array, tickTimerState: TickTimerState): IKeyboardObserver {
  function start(): void {
    document.addEventListener("keydown", _onKeyDown);
  }

  function stop(): void {
    document.removeEventListener("keydown", _onKeyDown);
  }

  function update(): void {}

  function _onKeyDown(evt: KeyboardEvent): void {
    console.log(evt.which);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isKeyboardObserver: true,
    name: "KeyboardObserver",

    start: start,
    stop: stop,
    update: update,
  });
}
