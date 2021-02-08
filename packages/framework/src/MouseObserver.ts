import { MathUtils } from "three/src/math/MathUtils";

import { computePointerStretchVectorX } from "./computePointerStretchVectorX";
import { computePointerStretchVectorY } from "./computePointerStretchVectorY";
import { computePointerVectorX } from "./computePointerVectorX";
import { computePointerVectorY } from "./computePointerVectorY";
import { DimensionsIndices } from "./DimensionsIndices.enum";
import { InputIndices } from "./InputIndices.enum";
import { isInDimensionsBounds } from "./isInDimensionsBounds";
import { MouseButtons } from "./MouseButtons.enum";
import { passiveEventListener } from "./passiveEventListener";

import type { MouseObserver as IMouseObserver } from "./MouseObserver.interface";
import type { TickTimerState } from "./TickTimerState.type";

export function MouseObserver(htmlElement: HTMLElement, dimensionsState: Uint32Array, inputState: Int32Array, tickTimerState: TickTimerState): IMouseObserver {
  function start(): void {
    document.addEventListener("mousedown", _onMouseDown, passiveEventListener);
    document.addEventListener("mousemove", _onMouseChange, passiveEventListener);
    document.addEventListener("mouseup", _onMouseUp, passiveEventListener);
  }

  function stop(): void {
    document.removeEventListener("mousedown", _onMouseDown);
    document.removeEventListener("mousemove", _onMouseChange);
    document.removeEventListener("mouseup", _onMouseUp);
  }

  function update(): void {
    if (dimensionsState[DimensionsIndices.LAST_UPDATE] > inputState[InputIndices.LAST_UPDATE]) {
      _updateDimensionsRelativeCoords();
    }
  }

  function _onMouseChange(evt: MouseEvent): void {
    inputState[InputIndices.M_LAST_USED] = tickTimerState.currentTick;
    inputState[InputIndices.M_BUTTON_L] = evt.buttons & MouseButtons.Primary;
    inputState[InputIndices.M_BUTTON_R] = evt.buttons & MouseButtons.Secondary;
    inputState[InputIndices.M_BUTTON_M] = evt.buttons & MouseButtons.Middle;
    inputState[InputIndices.M_BUTTON_4] = evt.buttons & MouseButtons.Generic1;
    inputState[InputIndices.M_BUTTON_5] = evt.buttons & MouseButtons.Generic2;

    inputState[InputIndices.M_CLIENT_X] = evt.clientX;
    inputState[InputIndices.M_CLIENT_Y] = evt.clientY;

    if (evt.buttons) {
      inputState[InputIndices.M_STRETCH_VECTOR_X] = computePointerStretchVectorX(
        dimensionsState,
        inputState[InputIndices.M_DOWN_INITIAL_CLIENT_X],
        inputState[InputIndices.M_CLIENT_X]
      );
      inputState[InputIndices.M_STRETCH_VECTOR_Y] = computePointerStretchVectorY(
        dimensionsState,
        inputState[InputIndices.M_DOWN_INITIAL_CLIENT_Y],
        inputState[InputIndices.M_CLIENT_Y]
      );
    }

    // Update relative values to keep the mouse state consistent.
    _updateDimensionsRelativeCoords();
  }

  function _onMouseDown(evt: MouseEvent): void {
    inputState[InputIndices.M_INITIATED_BY_ROOT_ELEMENT] = Number(htmlElement === evt.target);
    inputState[InputIndices.M_DOWN_INITIAL_CLIENT_X] = evt.clientX;
    inputState[InputIndices.M_DOWN_INITIAL_CLIENT_Y] = evt.clientY;

    _onMouseChange(evt);
  }

  function _onMouseUp(evt: MouseEvent): void {
    inputState[InputIndices.M_INITIATED_BY_ROOT_ELEMENT] = 0;

    _onMouseChange(evt);
  }

  function _updateDimensionsRelativeCoords(): void {
    inputState[InputIndices.M_RELATIVE_X] = inputState[InputIndices.M_CLIENT_X] - dimensionsState[DimensionsIndices.P_LEFT];
    inputState[InputIndices.M_RELATIVE_Y] = inputState[InputIndices.M_CLIENT_Y] - dimensionsState[DimensionsIndices.P_TOP];
    inputState[InputIndices.M_VECTOR_X] = computePointerVectorX(dimensionsState, inputState[InputIndices.M_RELATIVE_X]);
    inputState[InputIndices.M_VECTOR_Y] = computePointerVectorY(dimensionsState, inputState[InputIndices.M_RELATIVE_Y]);
    inputState[InputIndices.M_IN_BOUNDS] = Number(isInDimensionsBounds(dimensionsState, inputState[InputIndices.M_CLIENT_X], inputState[InputIndices.M_CLIENT_Y]));

    inputState[InputIndices.LAST_UPDATE] = tickTimerState.currentTick;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isMouseObserver: true,
    name: "MouseObserver",

    start: start,
    stop: stop,
    update: update,
  });
}
