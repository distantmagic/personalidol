import type { TargetedEntity } from "./TargetedEntity.type";
import type { TargetingEntity } from "./TargetingEntity.type";

export function isTargetedBy(target: TargetedEntity, targetedBy: TargetingEntity): boolean {
  return target.properties.targetname === targetedBy.properties.target;
}
