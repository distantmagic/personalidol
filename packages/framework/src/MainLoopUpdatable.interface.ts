import type { MainLoopUpdateCallback } from "./MainLoopUpdateCallback.type";

export interface MainLoopUpdatable {
  readonly update: MainLoopUpdateCallback;
}
