import type { View } from "@personalidol/framework/src/View.interface";

import type { ViewGeometry } from "./ViewGeometry.type";

export interface WorldspawnGeometryView extends View {
  viewGeometry: ViewGeometry;
}
