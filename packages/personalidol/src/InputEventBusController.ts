import { MathUtils } from "three/src/math/MathUtils";

import { noop } from "@personalidol/framework/src/noop";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";

import type { InputController } from "./InputController.interface";
import type { InputControllerState } from "./InputControllerState.type";
import type { UserSettings } from "./UserSettings.type";

export function InputEventBusController(userSettings: UserSettings, eventBus: EventBus, cameraController: CameraController): InputController {
  const state: InputControllerState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: false,
  });

  function _onPointerZoomRequest(zoomAmount: number, scale: number = 1): void {
    if (state.isPaused) {
      return;
    }

    if (zoomAmount < 0) {
      cameraController.zoomOut();
    } else {
      cameraController.zoomIn();
    }
  }

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;
    eventBus.POINTER_ZOOM_REQUEST.add(_onPointerZoomRequest);
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    state.isPreloaded = true;
    state.isPreloading = false;
  }

  function unmount(): void {
    state.isMounted = false;
    eventBus.POINTER_ZOOM_REQUEST.delete(_onPointerZoomRequest);
  }

  function unpause(): void {
    state.isPaused = false;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isInputController: true,
    name: "InputEventBusController",
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: noop,
  });
}
