import { MathUtils } from "three/src/math/MathUtils";

import { KeyboardIndices } from "@personalidol/input/src/KeyboardIndices.enum";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { UserInputController } from "./UserInputController.interface";
import type { UserInputControllerState } from "./UserInputControllerState.type";
import type { UserSettings } from "./UserSettings.type";

export function UserInputKeyboardController(
  userSettings: UserSettings,
  keyboardState: Uint8Array,
  cameraController: CameraController
): UserInputController {
  const state: UserInputControllerState = Object.seal({
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  function mount(): void {
    state.isMounted = true;
  }

  function pause(): void {
    state.isPaused = true;
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
      cameraController.resetPosition();
      cameraController.resetZoom();
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isMountable: true,
    isUserInputController: true,
    name: "UserInputKeyboardController",
    state: state,

    mount: mount,
    pause: pause,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
