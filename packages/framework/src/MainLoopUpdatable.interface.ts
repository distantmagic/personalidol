import type { MainLoopUpdateCallback } from "./MainLoopUpdateCallback.type";

export interface MainLoopUpdatable {
  update: MainLoopUpdateCallback;
}
