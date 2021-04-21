import type { RigidBodyRemoteHandle } from "@personalidol/dynamics/src/RigidBodyRemoteHandle.interface";

import type { EntityController } from "./EntityController.interface";
import type { NPCEntity } from "./NPCEntity.type";

export interface NPCEntityController<E extends NPCEntity> extends EntityController<E> {
  rigidBody: RigidBodyRemoteHandle;
}
