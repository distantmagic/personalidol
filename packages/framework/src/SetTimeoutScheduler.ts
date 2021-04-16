import type { Scheduler } from "./Scheduler.interface";
import type { SchedulerCallback } from "./SchedulerCallback.type";

type TickType = ReturnType<typeof setTimeout>;

function cancelFrame(frameId: TickType): void {
  clearTimeout(frameId);
}

function isSupported(): boolean {
  return true;
}

function requestFrame(callback: SchedulerCallback): TickType {
  return setTimeout(callback, (1000 / 60) as any);
}

export function SetTimeoutScheduler(): Scheduler<TickType> {
  return Object.freeze({
    cancelFrame: cancelFrame,
    isSupported: isSupported,
    requestFrame: requestFrame,
  });
}
