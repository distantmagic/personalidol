import type { Nameable } from "./Nameable.interface";
import type { SchedulerCallback } from "./SchedulerCallback.type";

export interface Scheduler<T> extends Nameable {
  cancelFrame(frameId: T): void;

  requestFrame(callback: SchedulerCallback): T;
}
