import { MathUtils } from "three/src/math/MathUtils";

import { Vector2 } from "three/src/math/Vector2";

import { computePrimaryPointerStretchVector } from "@personalidol/input/src/computePrimaryPointerStretchVector";
import { isPointerInitiatedByRootElement } from "@personalidol/input/src/isPointerInitiatedByRootElement";
import { isPrimaryPointerPressed } from "@personalidol/input/src/isPrimaryPointerPressed";

import type { Vector2 as IVector2 } from "three/src/math/Vector2";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { InputController } from "./InputController.interface";
import type { InputControllerState } from "./InputControllerState.type";
import type { UserSettings } from "./UserSettings.type";

const _stretchVector: IVector2 = new Vector2(0, 0);
const _stretchVectorRotationPivot: IVector2 = new Vector2(0, 0);

export function InputMouseController(
  userSettings: UserSettings,
  dimensionsState: Uint32Array,
  mouseState: Int32Array,
  touchState: Int32Array,
  cameraController: CameraController
): InputController {
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

    if (isPrimaryPointerPressed(mouseState, touchState) && isPointerInitiatedByRootElement(mouseState, touchState)) {
      computePrimaryPointerStretchVector(_stretchVector, dimensionsState, mouseState, touchState);

      _stretchVector.rotateAround(_stretchVectorRotationPivot, (3 * Math.PI) / 4);

      cameraController.position.x += userSettings.cameraMovementSpeed * _stretchVector.y * delta;
      cameraController.position.z += userSettings.cameraMovementSpeed * _stretchVector.x * delta;
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isInputController: true,
    name: "InputMouseController",
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
