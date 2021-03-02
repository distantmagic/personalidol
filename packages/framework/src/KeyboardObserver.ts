import { MathUtils } from "three/src/math/MathUtils";

import type { KeyboardObserver as IKeyboardObserver } from "./KeyboardObserver.interface";
import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { TickTimerState } from "./TickTimerState.type";

export function KeyboardObserver(htmlElement: HTMLElement, keyboardState: Uint32Array, tickTimerState: TickTimerState): IKeyboardObserver {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  function start(): void {
    document.addEventListener("keydown", _onKeyDown);
  }

  function stop(): void {
    document.removeEventListener("keydown", _onKeyDown);
  }

  function update(): void {}

  function _onKeyDown(evt: KeyboardEvent): void {
    // console.log(evt.which);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isKeyboardObserver: true,
    name: "KeyboardObserver",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
