import type { Scheduler } from "./Scheduler.interface";
import type { SchedulerCallback } from "./SchedulerCallback.type";

type TickType = ReturnType<typeof setTimeout>;

function cancelFrame(frameId: TickType): void {
  clearTimeout(frameId);
}

function requestFrame(callback: SchedulerCallback): TickType {
  return setTimeout(callback, 10);
}

export function SetTimeoutScheduler(): Scheduler<TickType> {
  return Object.freeze({
    cancelFrame: cancelFrame,
    requestFrame: requestFrame,
  });
}
