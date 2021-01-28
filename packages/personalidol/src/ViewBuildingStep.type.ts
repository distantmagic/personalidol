import type { EntityAny } from "./EntityAny.type";
import type { TargetedEntity } from "./TargetedEntity.type";

export type ViewBuildingStep = {
  entity: EntityAny;
  targetedEntities: ReadonlyArray<TargetedEntity>;
};
