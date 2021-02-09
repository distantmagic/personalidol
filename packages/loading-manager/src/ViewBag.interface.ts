import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Pauseable } from "@personalidol/framework/src/Pauseable.interface";
import type { View } from "@personalidol/framework/src/View.interface";

import type { PollablePreloadingState } from "./PollablePreloadingState.interface";
import type { ViewBagState } from "./ViewBagState.type";

export interface ViewBag extends Mountable, Pauseable, PollablePreloadingState {
  readonly state: ViewBagState;
  readonly views: Set<View>;
}
