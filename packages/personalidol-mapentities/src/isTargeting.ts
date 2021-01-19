import type { EntityAny } from "./EntityAny.type";
import type { TargetingEntity } from "./TargetingEntity.type";

export function isTargeting(entity: EntityAny): entity is TargetingEntity {
  return entity.properties.hasOwnProperty("target");
}
