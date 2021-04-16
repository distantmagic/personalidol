import type { Disposable } from "@personalidol/framework/src/Disposable.interface";
import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Pauseable } from "@personalidol/framework/src/Pauseable.interface";
import type { Preloadable } from "@personalidol/framework/src/Preloadable.interface";

import type { PollablePreloading } from "@personalidol/framework/src/PollablePreloading.interface";

import type { View } from "./View.interface";
import type { ViewBagState } from "./ViewBagState.type";

export interface ViewBag extends Disposable, MainLoopUpdatable, Mountable, Pauseable, PollablePreloading, Preloadable {
  readonly state: ViewBagState;
  readonly views: Set<View>;
}
