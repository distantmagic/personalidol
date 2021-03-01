import type { Mountable } from "./Mountable.interface";
import type { Pauseable } from "./Pauseable.interface";
import type { View } from "./View.interface";

import type { PollablePreloadingState } from "./PollablePreloadingState.interface";
import type { ViewBagState } from "./ViewBagState.type";

export interface ViewBag extends Mountable, Pauseable, PollablePreloadingState {
  readonly state: ViewBagState;
  readonly views: Set<View>;
}
