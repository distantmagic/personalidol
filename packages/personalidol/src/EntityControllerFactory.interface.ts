import type { AnyEntity } from "./AnyEntity.type";
import type { EntityController } from "./EntityController.interface";
import type { EntityView } from "./EntityView.interface";

export interface EntityControllerFactory {
  readonly isEntityControllerFactory: true;

  create<E extends AnyEntity>(entityView: EntityView<E>): Generator<EntityController<E>>;
}
