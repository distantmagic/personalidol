import type { AnyEntity } from "./AnyEntity.type";

export function isEntityOfClass<E extends AnyEntity, C extends E["classname"] = E["classname"]>(
  entity: AnyEntity,
  classname: C
): entity is E {
  return classname === entity.classname;
}
