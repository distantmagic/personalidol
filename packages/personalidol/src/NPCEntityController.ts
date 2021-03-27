import type { AnyEntity } from "./AnyEntity.type";
import type { EntityController } from "./EntityController.interface";
import type { EntityView } from "./EntityView.interface";

export function NPCEntityController<E extends AnyEntity>(view: EntityView<E>): EntityController<E> {
  return Object.freeze({
    isEntityController: true,
    view: view,
  });
}
