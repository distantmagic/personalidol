import type { Scheduler } from "./Scheduler.interface";
import type { SchedulerCallback } from "./SchedulerCallback.type";

type TickType = ReturnType<typeof setTimeout>;

function cancelFrame(frameId: TickType): void {
  clearTimeout(frameId);
}

export function SetTimeoutScheduler(timestep: number = 100 / 60): Scheduler<TickType> {
  function requestFrame(callback: SchedulerCallback): TickType {
    return setTimeout(callback, timestep as any);
  }

  return Object.freeze({
    cancelFrame: cancelFrame,
    requestFrame: requestFrame,
  });
}
