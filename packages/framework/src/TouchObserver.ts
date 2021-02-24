import { MathUtils } from "three/src/math/MathUtils";

import { computePointerStretchVectorX } from "./computePointerStretchVectorX";
import { computePointerStretchVectorY } from "./computePointerStretchVectorY";
import { computePointerVectorX } from "./computePointerVectorX";
import { computePointerVectorY } from "./computePointerVectorY";
import { DimensionsIndices } from "./DimensionsIndices.enum";
import { Input } from "./Input";
import { InputIndices } from "./InputIndices.enum";
import { isInDimensionsBounds } from "./isInDimensionsBounds";
import { passiveEventListener } from "./passiveEventListener";

import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { TickTimerState } from "./TickTimerState.type";
import type { TouchObserver as ITouchObserver } from "./TouchObserver.interface";

export function TouchObserver(htmlElement: HTMLElement, dimensionsState: Uint32Array, inputState: Int32Array, tickTimerState: TickTimerState): ITouchObserver {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  function start(): void {
    htmlElement.addEventListener("touchcancel", _onTouchChange, passiveEventListener);
    htmlElement.addEventListener("touchend", _onTouchEnd, passiveEventListener);
    htmlElement.addEventListener("touchmove", _onTouchChange, passiveEventListener);
    htmlElement.addEventListener("touchstart", _onTouchStart, passiveEventListener);
  }

  function stop(): void {
    htmlElement.removeEventListener("touchcancel", _onTouchChange);
    htmlElement.removeEventListener("touchend", _onTouchEnd);
    htmlElement.removeEventListener("touchmove", _onTouchChange);
    htmlElement.removeEventListener("touchstart", _onTouchStart);
  }

  function update(): void {
    if (dimensionsState[DimensionsIndices.LAST_UPDATE] > inputState[InputIndices.LAST_UPDATE]) {
      _updateDimensionsRelativeCoords();
    }
  }

  function _onTouchChange(evt: TouchEvent): void {
    inputState[InputIndices.T_LAST_USED] = tickTimerState.currentTick;
    inputState[InputIndices.T_TOTAL] = evt.touches.length;

    for (let i = 0; i < evt.touches.length && i < Input.range.touches_total; i += 1) {
      inputState[Input.touches[i].CLIENT_X] = evt.touches[i].clientX;
      inputState[Input.touches[i].CLIENT_Y] = evt.touches[i].clientY;
      inputState[Input.touches[i].PRESSURE] = Math.floor(evt.touches[i].force * 100);
      inputState[Input.touches[i].STRETCH_VECTOR_X] = computePointerStretchVectorX(
        dimensionsState,
        inputState[Input.touches[i].DOWN_INITIAL_CLIENT_X],
        inputState[Input.touches[i].CLIENT_X]
      );
      inputState[Input.touches[i].STRETCH_VECTOR_Y] = computePointerStretchVectorY(
        dimensionsState,
        inputState[Input.touches[i].DOWN_INITIAL_CLIENT_Y],
        inputState[Input.touches[i].CLIENT_Y]
      );
    }

    _updateDimensionsRelativeCoords();
  }

  function _onTouchEnd(evt: TouchEvent): void {
    inputState[InputIndices.T_INITIATED_BY_ROOT_ELEMENT] = 0;

    _onTouchChange(evt);
  }

  function _onTouchStart(evt: TouchEvent): void {
    inputState[InputIndices.T_INITIATED_BY_ROOT_ELEMENT] = Number(htmlElement === evt.target);

    for (let i = 0; i < evt.touches.length && i < Input.range.touches_total; i += 1) {
      inputState[Input.touches[i].DOWN_INITIAL_CLIENT_X] = evt.touches[i].clientX;
      inputState[Input.touches[i].DOWN_INITIAL_CLIENT_Y] = evt.touches[i].clientY;
    }

    _onTouchChange(evt);
  }

  function _updateDimensionsRelativeCoords(): void {
    for (let i = 0; i < inputState[InputIndices.T_TOTAL] && i < Input.range.touches_total; i += 1) {
      inputState[Input.touches[i].RELATIVE_X] = inputState[Input.touches[i].CLIENT_X] - dimensionsState[DimensionsIndices.P_LEFT];
      inputState[Input.touches[i].RELATIVE_Y] = inputState[Input.touches[i].CLIENT_Y] - dimensionsState[DimensionsIndices.P_TOP];
      inputState[Input.touches[i].VECTOR_X] = computePointerVectorX(dimensionsState, inputState[Input.touches[i].RELATIVE_X]);
      inputState[Input.touches[i].VECTOR_Y] = computePointerVectorY(dimensionsState, inputState[Input.touches[i].RELATIVE_Y]);
      inputState[Input.touches[i].IN_BOUNDS] = Number(isInDimensionsBounds(dimensionsState, inputState[Input.touches[i].CLIENT_X], inputState[Input.touches[i].CLIENT_Y]));
    }

    inputState[InputIndices.LAST_UPDATE] = tickTimerState.currentTick;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isTouchObserver: true,
    name: "TouchObserver",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
