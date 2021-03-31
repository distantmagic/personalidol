import { MathUtils } from "three/src/math/MathUtils";
import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";

import { getMousePointerVectorX } from "@personalidol/input/src/getMousePointerVectorX";
import { getMousePointerVectorY } from "@personalidol/input/src/getMousePointerVectorY";
import { isPotentiallyMouseClick } from "@personalidol/input/src/isPotentiallyMouseClick";
import { isPrimaryMouseButtonPressed } from "@personalidol/input/src/isPrimaryMouseButtonPressed";
import { isPrimaryMouseButtonPressInitiatedByRootElement } from "@personalidol/input/src/isPrimaryMouseButtonPressInitiatedByRootElement";

import type { Vector2 as IVector2 } from "three/src/math/Vector2";
import type { Vector3 as IVector3 } from "three/src/math/Vector3";

import type { Raycaster } from "@personalidol/input/src/Raycaster.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserInputMouseController } from "@personalidol/input/src/UserInputMouseController.interface";
import type { UserInputMouseControllerState } from "@personalidol/input/src/UserInputMouseControllerState.type";

import type { UserSettings } from "./UserSettings.type";

const _pointerVector: IVector2 = new Vector2(0, 0);
const _pointerVectorRotationPivot: IVector2 = new Vector2(0, 0);

export function UserInputMouseController(userSettings: UserSettings, dimensionsState: Uint32Array, mouseState: Int32Array, raycaster: Raycaster): UserInputMouseController {
  const state: UserInputMouseControllerState = Object.seal({
    isMounted: false,
    isPaused: false,
    isPressStarted: false,
    isPressStartedWithIntersection: false,
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

    if (state.isPaused || !isPrimaryMouseButtonPressed(mouseState) || !isPrimaryMouseButtonPressInitiatedByRootElement(mouseState)) {
      state.isPressStartedWithIntersection = false;
      state.isPressStarted = false;

      return;
    }

    if (!state.isPressStarted && raycaster.state.hasIntersections && isPotentiallyMouseClick(mouseState)) {
      state.isPressStartedWithIntersection = true;
    }

    state.isPressStarted = true;

    _pointerVector.x = getMousePointerVectorX(dimensionsState, mouseState);
    _pointerVector.y = getMousePointerVectorY(dimensionsState, mouseState);

    if (_pointerVector.length() < 0.05) {
      // Create some dead-zone in the middle to be able to interact with the
      // player character.
      return;
    }

    _pointerVector.rotateAround(_pointerVectorRotationPivot, (3 * Math.PI) / 4);
    _pointerVector.normalize();

    _cameraTransitionRequest.x += userSettings.cameraMovementSpeed * _pointerVector.y * delta;
    _cameraTransitionRequest.z += userSettings.cameraMovementSpeed * _pointerVector.x * delta;
  }

  return Object.freeze({
    cameraTransitionRequest: _cameraTransitionRequest,
    id: MathUtils.generateUUID(),
    isMountable: true,
    isUserInputController: true,
    name: "UserInputMouseController",
    state: state,

    mount: mount,
    pause: pause,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
