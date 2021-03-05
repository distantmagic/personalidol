import type { AnyEntity } from "./AnyEntity.type";
import type { EntityWithObjectLabel } from "./EntityWithObjectLabel.type";

export function isEntityWithObjectLabel(entity: AnyEntity): entity is EntityWithObjectLabel {
  return "string" === typeof entity.properties.label;
}
