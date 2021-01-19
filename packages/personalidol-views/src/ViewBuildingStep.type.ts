import type { EntityAny } from "@personalidol/personalidol-mapentities/src/EntityAny.type";
import type { TargetedEntity } from "@personalidol/personalidol-mapentities/src/TargetedEntity.type";

export type ViewBuildingStep = {
  entity: EntityAny;
  targetedEntities: ReadonlyArray<TargetedEntity>;
};
