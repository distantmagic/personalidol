import { MathUtils } from "three/src/math/MathUtils";

import { computePointerStretchVectorX } from "./computePointerStretchVectorX";
import { computePointerStretchVectorY } from "./computePointerStretchVectorY";
import { computePointerVectorX } from "./computePointerVectorX";
import { computePointerVectorY } from "./computePointerVectorY";
import { DimensionsIndices } from "./DimensionsIndices.enum";
import { isInDimensionsBounds } from "./isInDimensionsBounds";
import { MouseButtons } from "./MouseButtons.enum";
import { passiveEventListener } from "./passiveEventListener";
import { Pointer } from "./Pointer";
import { PointerIndices } from "./PointerIndices.enum";

import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { MouseObserver as IMouseObserver } from "./MouseObserver.interface";
import type { TickTimerState } from "./TickTimerState.type";
import type { WindowFocusObserverState } from "./WindowFocusObserverState.type";

export function MouseObserver(
  htmlElement: HTMLElement,
  dimensionsState: Uint32Array,
  pointerState: Int32Array,
  windowFocusObserverState: WindowFocusObserverState,
  tickTimerState: TickTimerState
): IMouseObserver {
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
      pointerState.fill(0, Pointer.range_mouse_first, Pointer.range_mouse_last);
      pointerState[PointerIndices.LAST_UPDATE] = tickTimerState.currentTick;
    }

    if (!windowFocusObserverState.isDocumentFocused) {
      return;
    }

    if (windowFocusObserverState.isDocumentFocused && !_isListening) {
      _attachListeners();
    }

    if (dimensionsState[DimensionsIndices.LAST_UPDATE] > pointerState[PointerIndices.LAST_UPDATE]) {
      _updateDimensionsRelativeCoords();
    }
  }

  function _attachListeners() {
    if (_isListening) {
      throw new Error("Mouse listeners are already attached.");
    }

    _isListening = true;

    document.addEventListener("mousedown", _onMouseDown, passiveEventListener);
    document.addEventListener("mousemove", _onMouseChange, passiveEventListener);
    document.addEventListener("mouseup", _onMouseUp, passiveEventListener);
  }

  function _detachListeners() {
    if (!_isListening) {
      throw new Error("Mouse listeners are already detached.");
    }

    _isListening = false;

    document.removeEventListener("mousedown", _onMouseDown);
    document.removeEventListener("mousemove", _onMouseChange);
    document.removeEventListener("mouseup", _onMouseUp);
  }

  function _onMouseChange(evt: MouseEvent): void {
    pointerState[PointerIndices.M_LAST_USED] = tickTimerState.currentTick;
    pointerState[PointerIndices.M_BUTTON_L] = evt.buttons & MouseButtons.Primary;
    pointerState[PointerIndices.M_BUTTON_R] = evt.buttons & MouseButtons.Secondary;
    pointerState[PointerIndices.M_BUTTON_M] = evt.buttons & MouseButtons.Middle;
    pointerState[PointerIndices.M_BUTTON_4] = evt.buttons & MouseButtons.Generic1;
    pointerState[PointerIndices.M_BUTTON_5] = evt.buttons & MouseButtons.Generic2;

    pointerState[PointerIndices.M_CLIENT_X] = evt.clientX;
    pointerState[PointerIndices.M_CLIENT_Y] = evt.clientY;

    if (evt.buttons) {
      pointerState[PointerIndices.M_STRETCH_VECTOR_X] = computePointerStretchVectorX(
        dimensionsState,
        pointerState[PointerIndices.M_DOWN_INITIAL_CLIENT_X],
        pointerState[PointerIndices.M_CLIENT_X]
      );
      pointerState[PointerIndices.M_STRETCH_VECTOR_Y] = computePointerStretchVectorY(
        dimensionsState,
        pointerState[PointerIndices.M_DOWN_INITIAL_CLIENT_Y],
        pointerState[PointerIndices.M_CLIENT_Y]
      );
    }

    // Update relative values to keep the mouse state consistent.
    _updateDimensionsRelativeCoords();
  }

  function _onMouseDown(evt: MouseEvent): void {
    pointerState[PointerIndices.M_INITIATED_BY_ROOT_ELEMENT] = Number(htmlElement === evt.target);
    pointerState[PointerIndices.M_DOWN_INITIAL_CLIENT_X] = evt.clientX;
    pointerState[PointerIndices.M_DOWN_INITIAL_CLIENT_Y] = evt.clientY;

    _onMouseChange(evt);
  }

  function _onMouseUp(evt: MouseEvent): void {
    pointerState[PointerIndices.M_INITIATED_BY_ROOT_ELEMENT] = 0;

    _onMouseChange(evt);
  }

  function _updateDimensionsRelativeCoords(): void {
    pointerState[PointerIndices.M_RELATIVE_X] = pointerState[PointerIndices.M_CLIENT_X] - dimensionsState[DimensionsIndices.P_LEFT];
    pointerState[PointerIndices.M_RELATIVE_Y] = pointerState[PointerIndices.M_CLIENT_Y] - dimensionsState[DimensionsIndices.P_TOP];
    pointerState[PointerIndices.M_VECTOR_X] = computePointerVectorX(dimensionsState, pointerState[PointerIndices.M_RELATIVE_X]);
    pointerState[PointerIndices.M_VECTOR_Y] = computePointerVectorY(dimensionsState, pointerState[PointerIndices.M_RELATIVE_Y]);
    pointerState[PointerIndices.M_IN_BOUNDS] = Number(isInDimensionsBounds(dimensionsState, pointerState[PointerIndices.M_CLIENT_X], pointerState[PointerIndices.M_CLIENT_Y]));

    pointerState[PointerIndices.LAST_UPDATE] = tickTimerState.currentTick;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isMouseObserver: true,
    name: "MouseObserver",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
