import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { View } from "@personalidol/framework/src/View.interface";

import type { PollablePreloadingState } from "./PollablePreloadingState.interface";

export interface ViewBag extends Mountable, PollablePreloadingState {
  readonly views: Set<View>;
}
