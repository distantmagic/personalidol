import type { View } from "@personalidol/framework/src/View.interface";

import type { WorldspawnGeometryViewTHREE } from "./WorldspawnGeometryViewTHREE.type";

export interface WorldspawnGeometryView extends View {
  three: WorldspawnGeometryViewTHREE;
}
