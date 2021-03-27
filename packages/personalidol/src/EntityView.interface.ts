import type { View } from "@personalidol/views/src/View.interface";

import type { AnyEntity } from "./AnyEntity.type";

export interface EntityView<E extends AnyEntity> extends View {
  entity: E;
  isEntityView: true;
  isExpectingTargets: boolean;
}
