import type { EntityAny } from "./EntityAny.type";
import type { TargetedEntity } from "./TargetedEntity.type";

export function isTarget(entity: EntityAny): entity is TargetedEntity {
  return entity.properties.hasOwnProperty("targetname");
}
