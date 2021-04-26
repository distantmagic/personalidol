import { MathUtils } from "three/src/math/MathUtils";

import type { Scheduler } from "./Scheduler.interface";
import type { SchedulerCallback } from "./SchedulerCallback.type";

type TickType = ReturnType<typeof setTimeout>;

function cancelFrame(frameId: TickType): void {
  clearTimeout(frameId);
}

export function SetTimeoutScheduler(timestep: number = 1000 / 60): Scheduler<TickType> {
  function requestFrame(callback: SchedulerCallback): TickType {
    return setTimeout(callback, timestep as any);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: `SetTimeoutScheduler(${timestep})`,

    cancelFrame: cancelFrame,
    requestFrame: requestFrame,
  });
}
