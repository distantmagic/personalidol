import type { View } from "@personalidol/framework/src/View.interface";

import type { EntityView } from "./EntityView.interface";

export function isEntityView(view: View): view is EntityView {
  return (view as EntityView).isEntityView;
}
