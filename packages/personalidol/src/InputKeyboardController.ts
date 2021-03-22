import { MathUtils } from "three/src/math/MathUtils";

import { KeyboardIndices } from "@personalidol/input/src/KeyboardIndices.enum";

import type { Vector3 } from "three/src/math/Vector3";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { InputController } from "./InputController.interface";
import type { InputControllerState } from "./InputControllerState.type";
import type { UserSettings } from "./UserSettings.type";

export function InputKeyboardController(userSettings: UserSettings, keyboardState: Uint8Array, cameraController: CameraController, cameraResetPosition: Vector3): InputController {
  const state: InputControllerState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;
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
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    if (state.isPaused) {
      return;
    }

    if (keyboardState[KeyboardIndices.PageDown]) {
      cameraController.zoomIn(0.2);
    }

    if (keyboardState[KeyboardIndices.PageUp]) {
      cameraController.zoomOut(0.2);
    }

    if (keyboardState[KeyboardIndices.ArrowUp] || keyboardState[KeyboardIndices.KeyW]) {
      cameraController.position.x -= userSettings.cameraMovementSpeed * delta;
      cameraController.position.z -= userSettings.cameraMovementSpeed * delta;
    }

    if (keyboardState[KeyboardIndices.ArrowLeft] || keyboardState[KeyboardIndices.KeyA]) {
      cameraController.position.x -= userSettings.cameraMovementSpeed * delta;
      cameraController.position.z += userSettings.cameraMovementSpeed * delta;
    }

    if (keyboardState[KeyboardIndices.ArrowRight] || keyboardState[KeyboardIndices.KeyD]) {
      cameraController.position.x += userSettings.cameraMovementSpeed * delta;
      cameraController.position.z -= userSettings.cameraMovementSpeed * delta;
    }

    if (keyboardState[KeyboardIndices.ArrowDown] || keyboardState[KeyboardIndices.KeyS]) {
      cameraController.position.x += userSettings.cameraMovementSpeed * delta;
      cameraController.position.z += userSettings.cameraMovementSpeed * delta;
    }

    if (keyboardState[KeyboardIndices.Home]) {
      cameraController.position.copy(cameraResetPosition);
      cameraController.zoomReset();
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isInputController: true,
    name: "InputKeyboardController",
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
