import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { MainLoopUpdateCallback } from "./MainLoopUpdateCallback.type";

export interface MainLoopUpdatable {
  readonly state: MainLoopUpdatableState;
  readonly update: MainLoopUpdateCallback;
}
