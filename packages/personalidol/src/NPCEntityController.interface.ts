import type { EntityController } from "./EntityController.interface";
import type { NPCEntity } from "./NPCEntity.type";

export interface NPCEntityController<E extends NPCEntity> extends EntityController<E> {
  applyCentralImpulse(x: number, y: number, z: number): void;
}
