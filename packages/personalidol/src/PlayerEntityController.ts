import { MathUtils } from "three/src/math/MathUtils";

import { name } from "@personalidol/framework/src/name";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";
import type { UserInputController } from "@personalidol/input/src/UserInputController.interface";

import type { EntityController } from "./EntityController.interface";
import type { EntityControllerState } from "./EntityControllerState.type";
import type { EntityView } from "./EntityView.interface";
import type { EntityPlayer } from "./EntityPlayer.type";

export function PlayerEntityController(
  view: EntityView<EntityPlayer>,
  cameraController: CameraController,
  userInputEventBusController: UserInputController,
  userInputKeyboardController: UserInputController,
  userInputMouseController: UserInputController,
  userInputTouchController: UserInputController
): EntityController<EntityPlayer> {
  const state: EntityControllerState = Object.seal({
    isMounted: false,
    isPaused: false,
    needsUpdates: true,
  });

  function mount(): void {
    state.isMounted = true;

    cameraController.needsImmediateMove = true;
    cameraController.cameraResetPosition.copy(view.object3D.position);
    cameraController.resetPosition();
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

  function update(): void {
    view.object3D.position.x += userInputEventBusController.cameraTransitionRequest.x;
    view.object3D.position.x += userInputKeyboardController.cameraTransitionRequest.x;
    view.object3D.position.x += userInputMouseController.cameraTransitionRequest.x;
    view.object3D.position.x += userInputTouchController.cameraTransitionRequest.x;

    view.object3D.position.y += userInputEventBusController.cameraTransitionRequest.y;
    view.object3D.position.y += userInputKeyboardController.cameraTransitionRequest.y;
    view.object3D.position.y += userInputMouseController.cameraTransitionRequest.y;
    view.object3D.position.y += userInputTouchController.cameraTransitionRequest.y;

    view.object3D.position.z += userInputEventBusController.cameraTransitionRequest.z;
    view.object3D.position.z += userInputKeyboardController.cameraTransitionRequest.z;
    view.object3D.position.z += userInputMouseController.cameraTransitionRequest.z;
    view.object3D.position.z += userInputTouchController.cameraTransitionRequest.z;

    cameraController.cameraResetPosition.copy(view.object3D.position);
    cameraController.resetPosition();
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isEntityController: true,
    isMountable: true,
    name: `PlayerEntityController(${name(view)})`,
    state: state,
    view: view,

    mount: mount,
    pause: pause,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
