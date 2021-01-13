import type { Mount } from "@personalidol/framework/src/Mount.interface";
import type { View } from "@personalidol/framework/src/View.interface";

export interface ViewBag extends Mount {
  readonly views: Set<View>;

  updatePreloadingState(): void;
}
