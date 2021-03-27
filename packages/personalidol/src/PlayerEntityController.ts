import type { CameraController } from "@personalidol/framework/src/CameraController.interface";

import type { EntityController } from "./EntityController.interface";
import type { EntityView } from "./EntityView.interface";
import type { EntityPlayer } from "./EntityPlayer.type";

export function PlayerEntityController(view: EntityView<EntityPlayer>, cameraController: CameraController): EntityController<EntityPlayer> {
  cameraController.needsImmediateMove = true;
  cameraController.cameraResetPosition.set(view.entity.origin.x, view.entity.origin.y, view.entity.origin.z);
  cameraController.resetPosition();

  return Object.freeze({
    isEntityController: true,
    view: view,
  });
}
