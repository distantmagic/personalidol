import type { View } from "@personalidol/framework/src/View.interface";

import type { EntityAny } from "./EntityAny.type";

export interface EntityView extends View {
  entity: EntityAny;
  isEntityView: true;
  isExpectingTargets: boolean;
}
