import type { AnyEntity } from "./AnyEntity.type";
import type { TargetingEntity } from "./TargetingEntity.type";

export function isTargeting(entity: AnyEntity): entity is TargetingEntity {
  return entity.properties.hasOwnProperty("target");
}
