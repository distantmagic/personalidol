import { MainLoopBeginCallback } from "../types/MainLoopBeginCallback";
import { MainLoopDrawCallback } from "../types/MainLoopDrawCallback";
import { MainLoopEndCallback } from "../types/MainLoopEndCallback";
import { MainLoopUpdateCallback } from "../types/MainLoopUpdateCallback";

import { Scheduler } from "./Scheduler";

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
