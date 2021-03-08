import { MathUtils } from "three/src/math/MathUtils";

import type { Logger } from "loglevel";

import type { TickTimerState } from "./TickTimerState.type";
import type { WindowFocusObserver as IKeyboardObserver } from "./WindowFocusObserver.interface";
import type { WindowFocusObserverState } from "./WindowFocusObserverState.type";

export function WindowFocusObserver(logger: Logger, tickTimerState: TickTimerState): IKeyboardObserver {
  const state: WindowFocusObserverState = Object.seal({
    isDocumentFocused: false,
    isFocusChanged: false,
    lastUpdate: 0,
    needsUpdates: true,
  });

  function _onWindowBlur(): void {
    _setIsDocumentFocused(false);
  }

  function _onWindowFocus(): void {
    _setIsDocumentFocused(true);
  }

  function _setIsDocumentFocused(hasFocus: boolean): void {
    state.isFocusChanged = state.isDocumentFocused !== hasFocus;
    state.isDocumentFocused = hasFocus;

    if (state.isFocusChanged) {
      state.lastUpdate = tickTimerState.currentTick;
    }
  }

  function start(): void {
    window.addEventListener("blur", _onWindowBlur);
    window.addEventListener("focus", _onWindowFocus);
  }

  function stop(): void {
    window.removeEventListener("blur", _onWindowBlur);
    window.removeEventListener("focus", _onWindowFocus);
  }

  function update(): void {
    // This is also checked in a loop to be absolutely sure it's being caught.
    _setIsDocumentFocused(document.hasFocus());
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isWindowFocusObserver: true,
    name: "WindowFocusObserver",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
