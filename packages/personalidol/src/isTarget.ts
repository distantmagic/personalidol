import type { AnyEntity } from "./AnyEntity.type";
import type { TargetedEntity } from "./TargetedEntity.type";

export function isTarget(entity: AnyEntity): entity is TargetedEntity {
  return entity.properties.hasOwnProperty("targetname");
}
