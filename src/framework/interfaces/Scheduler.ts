import { MainLoopBeginCallback } from "../types/MainLoopBeginCallback";
import { MainLoopDrawCallback } from "../types/MainLoopDrawCallback";
import { MainLoopEndCallback } from "../types/MainLoopEndCallback";
import { MainLoopUpdateCallback } from "../types/MainLoopUpdateCallback";

export interface Scheduler {
  notifyBegin(timestamp: number, delta: number): void;

  notifyDraw(interpolationPercentage: number): void;

  notifyEnd(fps: number, isPanicked: boolean): void;

  notifyUpdate(delta: number): void;

  offBegin(callback: MainLoopBeginCallback): void;

  offDraw(callback: MainLoopDrawCallback): void;

  offEnd(callback: MainLoopEndCallback): void;

  offUpdate(callback: MainLoopUpdateCallback): void;

  onBegin(callback: MainLoopBeginCallback): void;

  onDraw(callback: MainLoopDrawCallback): void;

  onEnd(callback: MainLoopEndCallback): void;

  onUpdate(callback: MainLoopUpdateCallback): void;
}
