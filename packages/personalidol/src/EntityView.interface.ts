import type { View } from "@personalidol/framework/src/View.interface";

import type { AnyEntity } from "./AnyEntity.type";

export interface EntityView extends View {
  entity: AnyEntity;
  isEntityView: true;
  isExpectingTargets: boolean;
}
