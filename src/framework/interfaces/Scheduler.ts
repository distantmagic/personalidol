import MainLoopBeginCallback from "src/framework/types/MainLoopBeginCallback";
import MainLoopDrawCallback from "src/framework/types/MainLoopDrawCallback";
import MainLoopEndCallback from "src/framework/types/MainLoopEndCallback";
import MainLoopUpdateCallback from "src/framework/types/MainLoopUpdateCallback";

export default interface Scheduler {
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
