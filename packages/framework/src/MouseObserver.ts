import { computePointerVectorX } from "./computePointerVectorX";
import { computePointerVectorY } from "./computePointerVectorY";
import { Dimensions } from "./Dimensions";
import { Input } from "./Input";
import { isInDimensionsBounds } from "./isInDimensionsBounds";
import { passiveEventListener } from "./passiveEventListener";

import type { HTMLElementResizeObserverState } from "./HTMLElementResizeObserverState.type";
import type { MouseObserver as IMouseObserver } from "./MouseObserver.interface";
import type { MouseObserverState } from "./MouseObserverState.type";
import type { TickTimerState } from "./TickTimerState.type";

export function MouseObserver(
  htmlElement: HTMLElement,
  dimensionsState: Uint16Array,
  inputState: Int16Array,
  resizeObserverState: HTMLElementResizeObserverState,
  tickTimerState: TickTimerState
): IMouseObserver {
  const state: MouseObserverState = Object.seal({
    lastUpdate: 0,
  });

  function start(): void {
    document.addEventListener("mousedown", _onMouseChange, passiveEventListener);
    document.addEventListener("mousemove", _onMouseChange, passiveEventListener);
    document.addEventListener("mouseup", _onMouseChange, passiveEventListener);
  }

  function stop(): void {
    document.removeEventListener("mousedown", _onMouseChange);
    document.removeEventListener("mousemove", _onMouseChange);
    document.removeEventListener("mouseup", _onMouseChange);
  }

  function update(): void {
    if (resizeObserverState.lastUpdate > state.lastUpdate) {
      _updateRelativeCoords();
    }
  }

  function _onMouseChange(evt: MouseEvent): void {
    // primary button
    inputState[Input.code.M_BUTTON_L] = evt.buttons & 1;
    // secondary button
    inputState[Input.code.M_BUTTON_R] = evt.buttons & 2;
    // mouse wheel button / middle button
    inputState[Input.code.M_BUTTON_M] = evt.buttons & 4;
    // mouse 4th button
    inputState[Input.code.M_BUTTON_4] = evt.buttons & 8;
    // mouse 5th button
    inputState[Input.code.M_BUTTON_5] = evt.buttons & 16;

    inputState[Input.code.M_CLIENT_X] = evt.clientX;
    inputState[Input.code.M_CLIENT_Y] = evt.clientY;

    // Update relative values to keep the mouse state consistent.
    _updateRelativeCoords();
  }

  function _updateRelativeCoords(): void {
    inputState[Input.code.M_RELATIVE_X] = inputState[Input.code.M_CLIENT_X] - dimensionsState[Dimensions.code.P_LEFT];
    inputState[Input.code.M_RELATIVE_Y] = inputState[Input.code.M_CLIENT_Y] - dimensionsState[Dimensions.code.P_TOP];
    inputState[Input.code.M_VECTOR_X] = computePointerVectorX(dimensionsState, inputState[Input.code.M_RELATIVE_X]);
    inputState[Input.code.M_VECTOR_Y] = computePointerVectorY(dimensionsState, inputState[Input.code.M_RELATIVE_Y]);
    inputState[Input.code.M_IN_BOUNDS] = Number(isInDimensionsBounds(dimensionsState, inputState[Input.code.M_CLIENT_X], inputState[Input.code.M_CLIENT_Y]));

    state.lastUpdate = tickTimerState.currentTick;
  }

  return Object.freeze({
    name: "MouseObserver",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
