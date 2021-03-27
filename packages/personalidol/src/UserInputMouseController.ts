import { MathUtils } from "three/src/math/MathUtils";

import { Vector2 } from "three/src/math/Vector2";

import { getMousePointerVectorX } from "@personalidol/input/src/getMousePointerVectorX";
import { getMousePointerVectorY } from "@personalidol/input/src/getMousePointerVectorY";
import { isPotentiallyMouseClick } from "@personalidol/input/src/isPotentiallyMouseClick";
import { isPrimaryMouseButtonPressed } from "@personalidol/input/src/isPrimaryMouseButtonPressed";
import { isPrimaryMouseButtonPressInitiatedByRootElement } from "@personalidol/input/src/isPrimaryMouseButtonPressInitiatedByRootElement";

import type { Vector2 as IVector2 } from "three/src/math/Vector2";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";
import type { Raycaster } from "@personalidol/input/src/Raycaster.interface";
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
  cameraController: CameraController,
  raycaster: Raycaster
): UserInputController {
  const state: UserInputControllerState = Object.seal({
    isMounted: false,
    isPaused: false,
    needsUpdates: true,
  });

  let _started: boolean = false;
  let _startedWithinIntersection: boolean = false;

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
    if (state.isPaused || !isPrimaryMouseButtonPressed(mouseState) || !isPrimaryMouseButtonPressInitiatedByRootElement(mouseState)) {
      _startedWithinIntersection = false;
      _started = false;

      return;
    }

    if (!_started && raycaster.state.hasIntersections && isPotentiallyMouseClick(mouseState)) {
      _startedWithinIntersection = true;
    }

    _started = true;

    if (_startedWithinIntersection) {
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
