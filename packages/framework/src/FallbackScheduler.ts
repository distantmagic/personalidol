import { RequestAnimationFrameScheduler } from "./RequestAnimationFrameScheduler";
import { SetTimeoutScheduler } from "./SetTimeoutScheduler";

import type { Scheduler } from "./Scheduler.interface";

type TickType = ReturnType<typeof requestAnimationFrame | typeof setTimeout>;

export function FallbackScheduler(): Scheduler<TickType> {
  const rafScheduler = RequestAnimationFrameScheduler();
  const setTimeoutScheduler = SetTimeoutScheduler();

  if (rafScheduler.isSupported()) {
    return rafScheduler;
  }

  return setTimeoutScheduler;
}
