import type { SchedulerCallback } from "./SchedulerCallback.type";

export interface Scheduler<T> {
  cancelFrame(frameId: T): void;

  isSupported(): boolean;

  requestFrame(callback: SchedulerCallback): T;
}
