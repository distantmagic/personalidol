import { MathUtils } from "three/src/math/MathUtils";

import { isKeyboardKeyName } from "./isKeyboardKeyName";
import { KeyboardIndices } from "./KeyboardIndices.enum";

import type { Logger } from "loglevel";

import type { KeyboardObserver as IKeyboardObserver } from "./KeyboardObserver.interface";
import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { TickTimerState } from "./TickTimerState.type";
import type { WindowFocusObserverState } from "./WindowFocusObserverState.type";

export function KeyboardObserver(
  logger: Logger,
  htmlElement: HTMLElement,
  keyboardState: Uint8Array,
  windowFocusObserverState: WindowFocusObserverState,
  tickTimerState: TickTimerState
): IKeyboardObserver {
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
    const eventKeyCode: string = evt.code;

    if (!isKeyboardKeyName(eventKeyCode)) {
      logger.warn(`Unknown key pressed: ${evt.code}`);

      return;
    }

    console.log(evt.code, KeyboardIndices[eventKeyCode]);
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
