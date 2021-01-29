import type { EntityAny } from "./EntityAny.type";
import type { EntityWithObjectLabel } from "./EntityWithObjectLabel.type";

export function isEntityWithObjectLabel(entity: EntityAny): entity is EntityWithObjectLabel {
  return "string" === typeof entity.properties.label;
}
