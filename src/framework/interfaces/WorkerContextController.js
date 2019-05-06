// @flow

import type { WorkerContextMethods } from "../types/WorkerContextMethods";

export interface WorkerContextController<T: WorkerContextMethods> {
  attach(): void;

  onMessage(MessageEvent): Promise<void>;

  setMethods(T): void;
}
