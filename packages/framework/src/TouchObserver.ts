import { MathUtils } from "three/src/math/MathUtils";

import { computePointerStretchVectorX } from "./computePointerStretchVectorX";
import { computePointerStretchVectorY } from "./computePointerStretchVectorY";
import { computePointerVectorX } from "./computePointerVectorX";
import { computePointerVectorY } from "./computePointerVectorY";
import { DimensionsIndices } from "./DimensionsIndices.enum";
import { isInDimensionsBounds } from "./isInDimensionsBounds";
import { passiveEventListener } from "./passiveEventListener";
import { Pointer } from "./Pointer";
import { PointerIndices } from "./PointerIndices.enum";

import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { TickTimerState } from "./TickTimerState.type";
import type { TouchObserver as ITouchObserver } from "./TouchObserver.interface";
import type { WindowFocusObserverState } from "./WindowFocusObserverState.type";

export function TouchObserver(
  htmlElement: HTMLElement,
  dimensionsState: Uint32Array,
  pointerState: Int32Array,
  windowFocusObserverState: WindowFocusObserverState,
  tickTimerState: TickTimerState
): ITouchObserver {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  let _isListening: boolean = false;

  function start(): void {
    _attachListeners();
  }

  function stop(): void {
    if (_isListening) {
      // Service might be stopped while the document is out of focus.
      return;
    }

    _detachListeners();
  }

  function update(): void {
    if (!windowFocusObserverState.isDocumentFocused && _isListening) {
      _detachListeners();
    }

    if (!windowFocusObserverState.isDocumentFocused && windowFocusObserverState.lastUpdate > pointerState[PointerIndices.LAST_UPDATE]) {
      // Clear inputs if the game window is not focused.
      pointerState.fill(0, Pointer.range_touch_first, Pointer.range_touch_last);
      pointerState[PointerIndices.LAST_UPDATE] = tickTimerState.currentTick;
    }

    if (!windowFocusObserverState.isDocumentFocused) {
      return;
    }

    if (windowFocusObserverState.isDocumentFocused && !_isListening) {
      _attachListeners();
    }

    if (pointerState[PointerIndices.T_NAVIGATOR_MAX_TOUCH_POINTS] !== navigator.maxTouchPoints) {
      pointerState[PointerIndices.T_NAVIGATOR_MAX_TOUCH_POINTS] = navigator.maxTouchPoints;
      pointerState[PointerIndices.LAST_UPDATE] = tickTimerState.currentTick;
    }

    if (dimensionsState[DimensionsIndices.LAST_UPDATE] > pointerState[PointerIndices.LAST_UPDATE]) {
      _updateDimensionsRelativeCoords();
    }
  }

  function _attachListeners(): void {
    if (_isListening) {
      throw new Error("Touch listeners are already attached.");
    }

    _isListening = true;

    htmlElement.addEventListener("touchcancel", _onTouchChange, passiveEventListener);
    htmlElement.addEventListener("touchend", _onTouchEnd, passiveEventListener);
    htmlElement.addEventListener("touchmove", _onTouchChange, passiveEventListener);
    htmlElement.addEventListener("touchstart", _onTouchStart, passiveEventListener);
  }

  function _detachListeners(): void {
    if (!_isListening) {
      throw new Error("Touch listeners are already detached.");
    }

    _isListening = false;

    htmlElement.removeEventListener("touchcancel", _onTouchChange);
    htmlElement.removeEventListener("touchend", _onTouchEnd);
    htmlElement.removeEventListener("touchmove", _onTouchChange);
    htmlElement.removeEventListener("touchstart", _onTouchStart);
  }

  function _onTouchChange(evt: TouchEvent): void {
    pointerState[PointerIndices.T_LAST_USED] = tickTimerState.currentTick;
    pointerState[PointerIndices.T_TOTAL] = evt.touches.length;

    for (let i = 0; i < evt.touches.length && i < Pointer.touches_total; i += 1) {
      pointerState[Pointer.touches[i].CLIENT_X] = evt.touches[i].clientX;
      pointerState[Pointer.touches[i].CLIENT_Y] = evt.touches[i].clientY;
      pointerState[Pointer.touches[i].PRESSURE] = Math.floor(evt.touches[i].force * 100);
      pointerState[Pointer.touches[i].STRETCH_VECTOR_X] = computePointerStretchVectorX(
        dimensionsState,
        pointerState[Pointer.touches[i].DOWN_INITIAL_CLIENT_X],
        pointerState[Pointer.touches[i].CLIENT_X]
      );
      pointerState[Pointer.touches[i].STRETCH_VECTOR_Y] = computePointerStretchVectorY(
        dimensionsState,
        pointerState[Pointer.touches[i].DOWN_INITIAL_CLIENT_Y],
        pointerState[Pointer.touches[i].CLIENT_Y]
      );
    }

    _updateDimensionsRelativeCoords();
  }

  function _onTouchEnd(evt: TouchEvent): void {
    pointerState[PointerIndices.T_INITIATED_BY_ROOT_ELEMENT] = 0;

    _onTouchChange(evt);
  }

  function _onTouchStart(evt: TouchEvent): void {
    pointerState[PointerIndices.T_INITIATED_BY_ROOT_ELEMENT] = Number(htmlElement === evt.target);

    for (let i = 0; i < evt.touches.length && i < Pointer.touches_total; i += 1) {
      pointerState[Pointer.touches[i].DOWN_INITIAL_CLIENT_X] = evt.touches[i].clientX;
      pointerState[Pointer.touches[i].DOWN_INITIAL_CLIENT_Y] = evt.touches[i].clientY;
    }

    _onTouchChange(evt);
  }

  function _updateDimensionsRelativeCoords(): void {
    for (let i = 0; i < pointerState[PointerIndices.T_TOTAL] && i < Pointer.touches_total; i += 1) {
      pointerState[Pointer.touches[i].RELATIVE_X] = pointerState[Pointer.touches[i].CLIENT_X] - dimensionsState[DimensionsIndices.P_LEFT];
      pointerState[Pointer.touches[i].RELATIVE_Y] = pointerState[Pointer.touches[i].CLIENT_Y] - dimensionsState[DimensionsIndices.P_TOP];
      pointerState[Pointer.touches[i].VECTOR_X] = computePointerVectorX(dimensionsState, pointerState[Pointer.touches[i].RELATIVE_X]);
      pointerState[Pointer.touches[i].VECTOR_Y] = computePointerVectorY(dimensionsState, pointerState[Pointer.touches[i].RELATIVE_Y]);
      pointerState[Pointer.touches[i].IN_BOUNDS] = Number(
        isInDimensionsBounds(dimensionsState, pointerState[Pointer.touches[i].CLIENT_X], pointerState[Pointer.touches[i].CLIENT_Y])
      );
    }

    pointerState[PointerIndices.LAST_UPDATE] = tickTimerState.currentTick;
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
