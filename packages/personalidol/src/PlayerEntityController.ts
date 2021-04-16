import { MathUtils } from "three/src/math/MathUtils";

import { longestVector3 } from "@personalidol/framework/src/longestVector3";
import { name } from "@personalidol/framework/src/name";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";
import type { UserInputController } from "@personalidol/input/src/UserInputController.interface";
import type { UserInputMouseController } from "@personalidol/input/src/UserInputMouseController.interface";

import type { CharacterView } from "./CharacterView.interface";
import type { EntityController } from "./EntityController.interface";
import type { EntityControllerState } from "./EntityControllerState.type";
import type { EntityPlayer } from "./EntityPlayer.type";

export function PlayerEntityController(
  view: CharacterView<EntityPlayer>,
  cameraController: CameraController,
  userInputEventBusController: UserInputController,
  userInputKeyboardController: UserInputController,
  userInputMouseController: UserInputMouseController,
  userInputTouchController: UserInputController
): EntityController<EntityPlayer> {
  const state: EntityControllerState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloading: false,
    isPreloaded: false,
    needsUpdates: true,
  });

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;

    cameraController.needsImmediateMove = true;
    cameraController.cameraResetPosition.copy(view.object3D.position);
    cameraController.resetPosition();
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

  function update(): void {
    const transitionVector = longestVector3(
      userInputEventBusController.cameraTransitionRequest,
      userInputKeyboardController.cameraTransitionRequest,
      userInputMouseController.cameraTransitionRequest,
      userInputTouchController.cameraTransitionRequest
    );

    view.transition(transitionVector);

    cameraController.cameraResetPosition.copy(view.object3D.position);
    cameraController.resetPosition();
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isDisposable: true,
    isEntityController: true,
    isMountable: true,
    isPreloadable: true,
    name: `PlayerEntityController(${name(view)})`,
    state: state,
    view: view,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
