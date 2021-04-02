import { MathUtils } from "three/src/math/MathUtils";
import { Vector3 } from "three/src/math/Vector3";

import { KeyboardIndices } from "@personalidol/input/src/KeyboardIndices.enum";

import type { Vector3 as IVector3 } from "three/src/math/Vector3";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserInputController } from "@personalidol/input/src/UserInputController.interface";
import type { UserInputControllerState } from "@personalidol/input/src/UserInputControllerState.type";

import type { UserSettings } from "./UserSettings.type";

export function UserInputKeyboardController(userSettings: UserSettings, keyboardState: Uint8Array, cameraController: CameraController): UserInputController {
  const state: UserInputControllerState = Object.seal({
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  const _cameraTransitionRequest: IVector3 = new Vector3();

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
    _cameraTransitionRequest.set(0, 0, 0);

    if (state.isPaused) {
      return;
    }

    if (keyboardState[KeyboardIndices.Home]) {
      cameraController.resetPosition();
      cameraController.resetZoom();

      return;
    }

    if (keyboardState[KeyboardIndices.PageDown]) {
      cameraController.zoomOut(0.2);
    }

    if (keyboardState[KeyboardIndices.PageUp]) {
      cameraController.zoomIn(0.2);
    }

    if (keyboardState[KeyboardIndices.ArrowUp] || keyboardState[KeyboardIndices.KeyW]) {
      _cameraTransitionRequest.x -= 1;
      _cameraTransitionRequest.z -= 1;
    }

    if (keyboardState[KeyboardIndices.ArrowLeft] || keyboardState[KeyboardIndices.KeyA]) {
      _cameraTransitionRequest.x -= 1;
      _cameraTransitionRequest.z += 1;
    }

    if (keyboardState[KeyboardIndices.ArrowRight] || keyboardState[KeyboardIndices.KeyD]) {
      _cameraTransitionRequest.x += 1;
      _cameraTransitionRequest.z -= 1;
    }

    if (keyboardState[KeyboardIndices.ArrowDown] || keyboardState[KeyboardIndices.KeyS]) {
      _cameraTransitionRequest.x += 1;
      _cameraTransitionRequest.z += 1;
    }

    _cameraTransitionRequest.normalize();
    _cameraTransitionRequest.multiplyScalar(userSettings.cameraMovementSpeed * delta);
  }

  return Object.freeze({
    cameraTransitionRequest: _cameraTransitionRequest,
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
