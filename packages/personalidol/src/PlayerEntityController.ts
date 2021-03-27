import type { Vector3 } from "three/src/math/Vector3";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";

import type { EntityController } from "./EntityController.interface";
import type { EntityView } from "./EntityView.interface";
import type { EntityPlayer } from "./EntityPlayer.type";

export function PlayerEntityController(view: EntityView<EntityPlayer>, cameraController: CameraController, cameraResetPosition: Vector3): EntityController<EntityPlayer> {
  cameraResetPosition.set(view.entity.origin.x, view.entity.origin.y, view.entity.origin.z);
  cameraController.position.copy(cameraResetPosition);
  cameraController.needsImmediateMove = true;

  return Object.freeze({
    isEntityController: true,
    view: view,
  });
}
