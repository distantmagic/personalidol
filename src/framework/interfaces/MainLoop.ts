import { MainLoopBeginCallback } from "src/framework/types/MainLoopBeginCallback";
import { MainLoopDrawCallback } from "src/framework/types/MainLoopDrawCallback";
import { MainLoopEndCallback } from "src/framework/types/MainLoopEndCallback";
import { MainLoopUpdateCallback } from "src/framework/types/MainLoopUpdateCallback";

import { Scheduler } from "src/framework/interfaces/Scheduler";

export interface MainLoop {
  attachScheduler(scheduler: Scheduler): void;

  // unset all callbacks
  clear(): void;

  clearBegin(): void;

  clearDraw(): void;

  clearEnd(): void;

  clearUpdate(): void;

  setBegin(callback: MainLoopBeginCallback): void;

  setDraw(callback: MainLoopDrawCallback): void;

  setEnd(callback: MainLoopEndCallback): void;

  setMaxAllowedFPS(fps: number): void;

  setUpdate(callback: MainLoopUpdateCallback): void;

  start(): void;

  stop(): void;
}
