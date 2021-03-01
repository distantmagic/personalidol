import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { SceneTransitionState } from "./SceneTransitionState.type";
import type { Service } from "./Service.interface";

export interface SceneTransition extends MainLoopUpdatable, Service {
  readonly state: SceneTransitionState;
}
