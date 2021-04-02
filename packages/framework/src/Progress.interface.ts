import type { Nameable } from "./Nameable.interface";
import type { ProgressCallback } from "./ProgressCallback.type";
import type { ProgressState } from "./ProgressState.type";

export interface Progress extends Nameable {
  readonly state: ProgressState;

  readonly progress: ProgressCallback;

  done(): void;

  error(err: Error): void;

  start(): void;

  wait<T>(promise: T | Promise<T>): Promise<T>;
}
