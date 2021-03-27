import type { AnyEntity } from "./AnyEntity.type";
import type { EntityView } from "./EntityView.interface";

export interface EntityController<E extends AnyEntity> {
  readonly view: EntityView<E>;
  readonly isEntityController: true;
}
