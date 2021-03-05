import type { AnyEntity } from "./AnyEntity.type";
import type { TargetedEntity } from "./TargetedEntity.type";

export type ViewBuildingStep = {
  entity: AnyEntity;
  targetedEntities: ReadonlyArray<TargetedEntity>;
};
