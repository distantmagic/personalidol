import { computePointerVectorX } from "./computePointerVectorX";
import { computePointerVectorY } from "./computePointerVectorY";
import { Dimensions } from "./Dimensions";
import { Input } from "./Input";
import { isInDimensionsBounds } from "./isInDimensionsBounds";
import { passiveEventListener } from "./passiveEventListener";

import type { HTMLElementResizeObserverState } from "./HTMLElementResizeObserverState.type";
import type { TickTimerState } from "./TickTimerState.type";
import type { TouchObserver as ITouchObserver } from "./TouchObserver.interface";
import type { TouchObserverState } from "./TouchObserverState.type";

export function TouchObserver(
  htmlElement: HTMLElement,
  dimensionsState: Uint16Array,
  inputState: Int16Array,
  resizeObserverState: HTMLElementResizeObserverState,
  tickTimerState: TickTimerState
): ITouchObserver {
  let _touches = 0;
  const state: TouchObserverState = Object.seal({
    lastUpdate: 0,
  });

  function start(): void {
    htmlElement.addEventListener("touchcancel", _onTouchChange, passiveEventListener);
    htmlElement.addEventListener("touchend", _onTouchChange, passiveEventListener);
    htmlElement.addEventListener("touchmove", _onTouchChange, passiveEventListener);
    htmlElement.addEventListener("touchstart", _onTouchChange, passiveEventListener);
  }

  function stop(): void {
    htmlElement.removeEventListener("touchcancel", _onTouchChange);
    htmlElement.removeEventListener("touchend", _onTouchChange);
    htmlElement.removeEventListener("touchmove", _onTouchChange);
    htmlElement.removeEventListener("touchstart", _onTouchChange);
  }

  function update(): void {
    if (resizeObserverState.lastUpdate > state.lastUpdate) {
      _updateRelativeCoords();
    }
  }

  function _onTouchChange(evt: TouchEvent): void {
    // reset touches state
    inputState.fill(0, Input.range.touches_min, Input.range.touches_max);

    _touches = evt.touches.length;

    for (let i = 0; i < _touches && i < Input.range.touches_total; i += 1) {
      inputState[Input.code[Input.touches[i].CLIENT_X]] = evt.touches[i].clientX;
      inputState[Input.code[Input.touches[i].CLIENT_Y]] = evt.touches[i].clientY;
      inputState[Input.code[Input.touches[i].PRESSURE]] = Math.floor(evt.touches[i].force * 100);
    }

    _updateRelativeCoords();
  }

  function _updateRelativeCoords(): void {
    for (let i = 0; i < _touches && i < Input.range.touches_total; i += 1) {
      inputState[Input.code[Input.touches[i].RELATIVE_X]] = inputState[Input.code[Input.touches[i].CLIENT_X]] - dimensionsState[Dimensions.code.P_LEFT];
      inputState[Input.code[Input.touches[i].RELATIVE_Y]] = inputState[Input.code[Input.touches[i].CLIENT_Y]] - dimensionsState[Dimensions.code.P_TOP];
      inputState[Input.code[Input.touches[i].VECTOR_X]] = computePointerVectorX(dimensionsState, inputState[Input.code[Input.touches[i].RELATIVE_X]]);
      inputState[Input.code[Input.touches[i].VECTOR_Y]] = computePointerVectorY(dimensionsState, inputState[Input.code[Input.touches[i].RELATIVE_Y]]);
      inputState[Input.code[Input.touches[i].IN_BOUNDS]] = Number(
        isInDimensionsBounds(dimensionsState, inputState[Input.code[Input.touches[i].CLIENT_X]], inputState[Input.code[Input.touches[i].CLIENT_Y]])
      );
    }

    state.lastUpdate = tickTimerState.currentTick;
  }

  return Object.freeze({
    name: "TouchObserver",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
