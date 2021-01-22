import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

import type { SceneTransitionState } from "./SceneTransitionState.type";

export interface SceneTransition extends MainLoopUpdatable, Service {
  readonly state: SceneTransitionState;
}
