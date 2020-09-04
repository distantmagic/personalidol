import { computePointerStretchVectorX } from "./computePointerStretchVectorX";
import { computePointerStretchVectorY } from "./computePointerStretchVectorY";
import { computePointerVectorX } from "./computePointerVectorX";
import { computePointerVectorY } from "./computePointerVectorY";
import { Dimensions } from "./Dimensions";
import { Input } from "./Input";
import { isInDimensionsBounds } from "./isInDimensionsBounds";
import { passiveEventListener } from "./passiveEventListener";

import type { TickTimerState } from "./TickTimerState.type";
import type { TouchObserver as ITouchObserver } from "./TouchObserver.interface";

export function TouchObserver(htmlElement: HTMLElement, dimensionsState: Uint32Array, inputState: Int32Array, tickTimerState: TickTimerState): ITouchObserver {
  function start(): void {
    htmlElement.addEventListener("touchcancel", _onTouchChange, passiveEventListener);
    htmlElement.addEventListener("touchend", _onTouchChange, passiveEventListener);
    htmlElement.addEventListener("touchmove", _onTouchChange, passiveEventListener);
    htmlElement.addEventListener("touchstart", _onTouchStart, passiveEventListener);
  }

  function stop(): void {
    htmlElement.removeEventListener("touchcancel", _onTouchChange);
    htmlElement.removeEventListener("touchend", _onTouchChange);
    htmlElement.removeEventListener("touchmove", _onTouchChange);
    htmlElement.removeEventListener("touchstart", _onTouchStart);
  }

  function update(): void {
    if (dimensionsState[Dimensions.code.LAST_UPDATE] > inputState[Input.code.LAST_UPDATE]) {
      _updateDimensionsRelativeCoords();
    }
  }

  function _onTouchChange(evt: TouchEvent): void {
    inputState[Input.code.T_TOTAL] = evt.touches.length;

    for (let i = 0; i < evt.touches.length && i < Input.range.touches_total; i += 1) {
      inputState[Input.code[Input.touches[i].CLIENT_X]] = evt.touches[i].clientX;
      inputState[Input.code[Input.touches[i].CLIENT_Y]] = evt.touches[i].clientY;
      inputState[Input.code[Input.touches[i].PRESSURE]] = Math.floor(evt.touches[i].force * 100);
      inputState[Input.code[Input.touches[i].STRETCH_VECTOR_X]] = computePointerStretchVectorX(
        dimensionsState,
        inputState[Input.code[Input.touches[i].DOWN_INITIAL_CLIENT_X]],
        inputState[Input.code[Input.touches[i].CLIENT_X]]
      );
      inputState[Input.code[Input.touches[i].STRETCH_VECTOR_Y]] = computePointerStretchVectorY(
        dimensionsState,
        inputState[Input.code[Input.touches[i].DOWN_INITIAL_CLIENT_Y]],
        inputState[Input.code[Input.touches[i].CLIENT_Y]]
      );
    }

    _updateDimensionsRelativeCoords();
  }

  function _onTouchStart(evt: TouchEvent): void {
    for (let i = 0; i < evt.touches.length && i < Input.range.touches_total; i += 1) {
      inputState[Input.code[Input.touches[i].DOWN_INITIAL_CLIENT_X]] = evt.touches[i].clientX;
      inputState[Input.code[Input.touches[i].DOWN_INITIAL_CLIENT_Y]] = evt.touches[i].clientY;
    }

    _onTouchChange(evt);
  }

  function _updateDimensionsRelativeCoords(): void {
    for (let i = 0; i < inputState[Input.code.T_TOTAL] && i < Input.range.touches_total; i += 1) {
      inputState[Input.code[Input.touches[i].RELATIVE_X]] = inputState[Input.code[Input.touches[i].CLIENT_X]] - dimensionsState[Dimensions.code.P_LEFT];
      inputState[Input.code[Input.touches[i].RELATIVE_Y]] = inputState[Input.code[Input.touches[i].CLIENT_Y]] - dimensionsState[Dimensions.code.P_TOP];
      inputState[Input.code[Input.touches[i].VECTOR_X]] = computePointerVectorX(dimensionsState, inputState[Input.code[Input.touches[i].RELATIVE_X]]);
      inputState[Input.code[Input.touches[i].VECTOR_Y]] = computePointerVectorY(dimensionsState, inputState[Input.code[Input.touches[i].RELATIVE_Y]]);
      inputState[Input.code[Input.touches[i].IN_BOUNDS]] = Number(
        isInDimensionsBounds(dimensionsState, inputState[Input.code[Input.touches[i].CLIENT_X]], inputState[Input.code[Input.touches[i].CLIENT_Y]])
      );
    }

    inputState[Input.code.LAST_UPDATE] = tickTimerState.currentTick;
  }

  return Object.freeze({
    name: "TouchObserver",

    start: start,
    stop: stop,
    update: update,
  });
}
