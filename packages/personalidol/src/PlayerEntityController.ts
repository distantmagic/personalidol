import { MathUtils } from "three/src/math/MathUtils";

import { name } from "@personalidol/framework/src/name";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";

import type { EntityController } from "./EntityController.interface";
import type { EntityControllerState } from "./EntityControllerState.type";
import type { EntityView } from "./EntityView.interface";
import type { EntityPlayer } from "./EntityPlayer.type";

export function PlayerEntityController(view: EntityView<EntityPlayer>, cameraController: CameraController): EntityController<EntityPlayer> {
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

  function update(): void {}

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
