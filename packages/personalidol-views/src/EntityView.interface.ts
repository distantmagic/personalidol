import type { EntityAny } from "@personalidol/personalidol-mapentities/src/EntityAny.type";
import type { View } from "@personalidol/framework/src/View.interface";

export interface EntityView extends View {
  entity: EntityAny;
  isEntityView: true;
  isExpectingTargets: boolean;
}
