import type { Scheduler } from "./Scheduler.interface";
import type { SchedulerCallback } from "./SchedulerCallback.type";

type TickType = ReturnType<typeof requestAnimationFrame>;

function cancelFrame(frameId: TickType): void {
  cancelAnimationFrame(frameId);
}

function isSupported(): boolean {
  return "function" === typeof globalThis.requestAnimationFrame;
}

function requestFrame(callback: SchedulerCallback): TickType {
  return requestAnimationFrame(callback);
}

export function RequestAnimationFrameScheduler(): Scheduler<TickType> {
  return Object.freeze({
    cancelFrame: cancelFrame,
    isSupported: isSupported,
    requestFrame: requestFrame,
  });
}
