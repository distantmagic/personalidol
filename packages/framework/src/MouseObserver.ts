import { MathUtils } from "three/src/math/MathUtils";

import { computePointerStretchVectorX } from "./computePointerStretchVectorX";
import { computePointerStretchVectorY } from "./computePointerStretchVectorY";
import { computePointerVectorX } from "./computePointerVectorX";
import { computePointerVectorY } from "./computePointerVectorY";
import { DimensionsIndices } from "./DimensionsIndices.enum";
import { isInDimensionsBounds } from "./isInDimensionsBounds";
import { MouseButtons } from "./MouseButtons.enum";
import { MouseIndices } from "./MouseIndices.enum";
import { MouseState } from "./MouseState";
import { passiveEventListener } from "./passiveEventListener";

import type { MouseObserver as IMouseObserver } from "./MouseObserver.interface";
import type { MouseObserverState } from "./MouseObserverState.type";
import type { TickTimerState } from "./TickTimerState.type";
import type { WindowFocusObserverState } from "./WindowFocusObserverState.type";

export function MouseObserver(
  htmlElement: HTMLElement,
  dimensionsState: Uint32Array,
  mouseState: Int32Array,
  windowFocusObserverState: WindowFocusObserverState,
  tickTimerState: TickTimerState
): IMouseObserver {
  const state: MouseObserverState = Object.seal({
    lastUpdate: 0,
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

    if (!windowFocusObserverState.isDocumentFocused && windowFocusObserverState.lastUpdate > state.lastUpdate) {
      // Clear inputs if the game window is not focused.
      mouseState.fill(0);
      state.lastUpdate = tickTimerState.currentTick;
    }

    if (!windowFocusObserverState.isDocumentFocused) {
      return;
    }

    if (windowFocusObserverState.isDocumentFocused && !_isListening) {
      _attachListeners();
    }

    if (dimensionsState[DimensionsIndices.LAST_UPDATE] > state.lastUpdate) {
      _updateDimensionsRelativeCoords();
    }
  }

  function _attachListeners() {
    if (_isListening) {
      throw new Error("MouseState listeners are already attached.");
    }

    _isListening = true;

    document.addEventListener("mousedown", _onMouseDown, passiveEventListener);
    document.addEventListener("mousemove", _onMouseChange, passiveEventListener);
    document.addEventListener("mouseup", _onMouseUp, passiveEventListener);
  }

  function _detachListeners() {
    if (!_isListening) {
      throw new Error("MouseState listeners are already detached.");
    }

    _isListening = false;

    document.removeEventListener("mousedown", _onMouseDown);
    document.removeEventListener("mousemove", _onMouseChange);
    document.removeEventListener("mouseup", _onMouseUp);
  }

  function _onMouseChange(evt: MouseEvent): void {
    mouseState[MouseIndices.M_LAST_USED] = tickTimerState.currentTick;
    mouseState[MouseIndices.M_BUTTON_L] = evt.buttons & MouseButtons.Primary;
    mouseState[MouseIndices.M_BUTTON_R] = evt.buttons & MouseButtons.Secondary;
    mouseState[MouseIndices.M_BUTTON_M] = evt.buttons & MouseButtons.Middle;
    mouseState[MouseIndices.M_BUTTON_4] = evt.buttons & MouseButtons.Generic1;
    mouseState[MouseIndices.M_BUTTON_5] = evt.buttons & MouseButtons.Generic2;

    mouseState[MouseIndices.M_CLIENT_X] = evt.clientX;
    mouseState[MouseIndices.M_CLIENT_Y] = evt.clientY;

    if (evt.buttons) {
      mouseState[MouseIndices.M_STRETCH_VECTOR_X] = computePointerStretchVectorX(
        dimensionsState,
        mouseState[MouseIndices.M_DOWN_INITIAL_CLIENT_X],
        mouseState[MouseIndices.M_CLIENT_X],
        MouseState.vector_scale
      );
      mouseState[MouseIndices.M_STRETCH_VECTOR_Y] = computePointerStretchVectorY(
        dimensionsState,
        mouseState[MouseIndices.M_DOWN_INITIAL_CLIENT_Y],
        mouseState[MouseIndices.M_CLIENT_Y],
        MouseState.vector_scale
      );
    }

    // Update relative values to keep the mouse state consistent.
    _updateDimensionsRelativeCoords();
  }

  function _onMouseDown(evt: MouseEvent): void {
    mouseState[MouseIndices.M_INITIATED_BY_ROOT_ELEMENT] = Number(htmlElement === evt.target);
    mouseState[MouseIndices.M_DOWN_INITIAL_CLIENT_X] = evt.clientX;
    mouseState[MouseIndices.M_DOWN_INITIAL_CLIENT_Y] = evt.clientY;

    _onMouseChange(evt);
  }

  function _onMouseUp(evt: MouseEvent): void {
    mouseState[MouseIndices.M_INITIATED_BY_ROOT_ELEMENT] = 0;

    _onMouseChange(evt);
  }

  function _updateDimensionsRelativeCoords(): void {
    mouseState[MouseIndices.M_RELATIVE_X] = mouseState[MouseIndices.M_CLIENT_X] - dimensionsState[DimensionsIndices.P_LEFT];
    mouseState[MouseIndices.M_RELATIVE_Y] = mouseState[MouseIndices.M_CLIENT_Y] - dimensionsState[DimensionsIndices.P_TOP];
    mouseState[MouseIndices.M_VECTOR_X] = computePointerVectorX(dimensionsState, mouseState[MouseIndices.M_RELATIVE_X], MouseState.vector_scale);
    mouseState[MouseIndices.M_VECTOR_Y] = computePointerVectorY(dimensionsState, mouseState[MouseIndices.M_RELATIVE_Y], MouseState.vector_scale);
    mouseState[MouseIndices.M_IN_BOUNDS] = Number(isInDimensionsBounds(dimensionsState, mouseState[MouseIndices.M_CLIENT_X], mouseState[MouseIndices.M_CLIENT_Y]));

    state.lastUpdate = tickTimerState.currentTick;
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
