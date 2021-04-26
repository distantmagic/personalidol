import type { SchedulerCallback } from "./SchedulerCallback.type";

export interface Scheduler<T> {
  cancelFrame(frameId: T): void;

  requestFrame(callback: SchedulerCallback): T;
}
