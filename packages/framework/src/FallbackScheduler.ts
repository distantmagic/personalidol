import { isRequestAnimationFrameSupported } from "./isRequestAnimationFrameSupported";
import { RequestAnimationFrameScheduler } from "./RequestAnimationFrameScheduler";
import { SetTimeoutScheduler } from "./SetTimeoutScheduler";

import type { Scheduler } from "./Scheduler.interface";

type TickType = ReturnType<typeof requestAnimationFrame | typeof setTimeout>;

export function FallbackScheduler(timestep: number = 1000 / 60): Scheduler<TickType> {
  if (isRequestAnimationFrameSupported()) {
    return RequestAnimationFrameScheduler();
  }

  return SetTimeoutScheduler(timestep);
}
