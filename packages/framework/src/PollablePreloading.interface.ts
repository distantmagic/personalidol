import type { MainLoopUpdateCallback } from "./MainLoopUpdateCallback.type";

export interface PollablePreloading {
  readonly isPollablePreloading: true;

  updatePreloadingState: MainLoopUpdateCallback;
}
