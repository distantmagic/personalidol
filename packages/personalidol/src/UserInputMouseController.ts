import { MathUtils } from "three/src/math/MathUtils";

import { Vector2 } from "three/src/math/Vector2";

import { getMousePointerVectorX } from "@personalidol/input/src/getMousePointerVectorX";
import { getMousePointerVectorY } from "@personalidol/input/src/getMousePointerVectorY";
import { isPrimaryMouseButtonPressed } from "@personalidol/input/src/isPrimaryMouseButtonPressed";
import { isPrimaryMouseButtonPressInitiatedByRootElement } from "@personalidol/input/src/isPrimaryMouseButtonPressInitiatedByRootElement";

import type { Vector2 as IVector2 } from "three/src/math/Vector2";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { UserInputController } from "./UserInputController.interface";
import type { UserInputControllerState } from "./UserInputControllerState.type";
import type { UserSettings } from "./UserSettings.type";

const _pointerVector: IVector2 = new Vector2(0, 0);
const _pointerVectorRotationPivot: IVector2 = new Vector2(0, 0);

export function UserInputMouseController(
  userSettings: UserSettings,
  dimensionsState: Uint32Array,
  mouseState: Int32Array,
  cameraController: CameraController
): UserInputController {
  const state: UserInputControllerState = Object.seal({
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

    if (!isPrimaryMouseButtonPressed(mouseState) || !isPrimaryMouseButtonPressInitiatedByRootElement(mouseState)) {
      return;
    }

    _pointerVector.x = getMousePointerVectorX(dimensionsState, mouseState);
    _pointerVector.y = getMousePointerVectorY(dimensionsState, mouseState);

    if (_pointerVector.length() < 0.05) {
      // Create some dead-zone in the middle to be able to interact with the
      // player character.
      return;
    }

    _pointerVector.rotateAround(_pointerVectorRotationPivot, (3 * Math.PI) / 4);
    _pointerVector.normalize();

    cameraController.position.x += userSettings.cameraMovementSpeed * _pointerVector.y * delta;
    cameraController.position.z += userSettings.cameraMovementSpeed * _pointerVector.x * delta;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isUserInputController: true,
    name: "UserInputMouseController",
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
