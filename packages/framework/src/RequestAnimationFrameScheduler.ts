import { MathUtils } from "three/src/math/MathUtils";

import type { Scheduler } from "./Scheduler.interface";
import type { SchedulerCallback } from "./SchedulerCallback.type";

type TickType = ReturnType<typeof requestAnimationFrame>;

function cancelFrame(frameId: TickType): void {
  cancelAnimationFrame(frameId);
}

function requestFrame(callback: SchedulerCallback): TickType {
  return requestAnimationFrame(callback);
}

export function RequestAnimationFrameScheduler(): Scheduler<TickType> {
  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "RequestAnimationFrameScheduler",

    cancelFrame: cancelFrame,
    requestFrame: requestFrame,
  });
}
