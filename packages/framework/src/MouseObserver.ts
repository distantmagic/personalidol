import { computePointerStretchVectorX } from "./computePointerStretchVectorX";
import { computePointerStretchVectorY } from "./computePointerStretchVectorY";
import { computePointerVectorX } from "./computePointerVectorX";
import { computePointerVectorY } from "./computePointerVectorY";
import { Dimensions } from "./Dimensions";
import { Input } from "./Input";
import { isInDimensionsBounds } from "./isInDimensionsBounds";
import { passiveEventListener } from "./passiveEventListener";

import type { MouseObserver as IMouseObserver } from "./MouseObserver.interface";
import type { TickTimerState } from "./TickTimerState.type";

export function MouseObserver(htmlElement: HTMLElement, dimensionsState: Uint32Array, inputState: Int32Array, tickTimerState: TickTimerState): IMouseObserver {
  function start(): void {
    document.addEventListener("mousedown", _onMouseDown, passiveEventListener);
    document.addEventListener("mousemove", _onMouseChange, passiveEventListener);
    document.addEventListener("mouseup", _onMouseChange, passiveEventListener);
  }

  function stop(): void {
    document.removeEventListener("mousedown", _onMouseDown);
    document.removeEventListener("mousemove", _onMouseChange);
    document.removeEventListener("mouseup", _onMouseChange);
  }

  function update(): void {
    if (dimensionsState[Dimensions.code.LAST_UPDATE] > inputState[Input.code.LAST_UPDATE]) {
      _updateDimensionsRelativeCoords();
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

    if (evt.buttons) {
      inputState[Input.code.M_STRETCH_VECTOR_X] = computePointerStretchVectorX(dimensionsState, inputState[Input.code.M_DOWN_INITIAL_CLIENT_X], inputState[Input.code.M_CLIENT_X]);
      inputState[Input.code.M_STRETCH_VECTOR_Y] = computePointerStretchVectorY(dimensionsState, inputState[Input.code.M_DOWN_INITIAL_CLIENT_Y], inputState[Input.code.M_CLIENT_Y]);
    }

    // Update relative values to keep the mouse state consistent.
    _updateDimensionsRelativeCoords();
  }

  function _onMouseDown(evt: MouseEvent): void {
    inputState[Input.code.M_DOWN_INITIAL_CLIENT_X] = evt.clientX;
    inputState[Input.code.M_DOWN_INITIAL_CLIENT_Y] = evt.clientY;

    _onMouseChange(evt);
  }

  function _updateDimensionsRelativeCoords(): void {
    inputState[Input.code.M_RELATIVE_X] = inputState[Input.code.M_CLIENT_X] - dimensionsState[Dimensions.code.P_LEFT];
    inputState[Input.code.M_RELATIVE_Y] = inputState[Input.code.M_CLIENT_Y] - dimensionsState[Dimensions.code.P_TOP];
    inputState[Input.code.M_VECTOR_X] = computePointerVectorX(dimensionsState, inputState[Input.code.M_RELATIVE_X]);
    inputState[Input.code.M_VECTOR_Y] = computePointerVectorY(dimensionsState, inputState[Input.code.M_RELATIVE_Y]);
    inputState[Input.code.M_IN_BOUNDS] = Number(isInDimensionsBounds(dimensionsState, inputState[Input.code.M_CLIENT_X], inputState[Input.code.M_CLIENT_Y]));

    inputState[Input.code.LAST_UPDATE] = tickTimerState.currentTick;
  }

  return Object.freeze({
    name: "MouseObserver",

    start: start,
    stop: stop,
    update: update,
  });
}
