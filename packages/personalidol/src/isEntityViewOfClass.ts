import { isEntityOfClass } from "./isEntityOfClass";

import type { AnyEntity } from "./AnyEntity.type";
import type { EntityView } from "./EntityView.interface";

export function isEntityViewOfClass<E extends AnyEntity, C extends E["classname"] = E["classname"]>(
  entityView: EntityView<AnyEntity>,
  classname: C
): entityView is EntityView<E> {
  return isEntityOfClass<E, C>(entityView.entity, classname);
}
