import { LoadingManagerState } from "./LoadingManagerState";
import { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";
import { LoadingManagerStateChangeCallback } from "../types/LoadingManagerStateChangeCallback";

export interface LoadingManager {
  background<T>(promise: Promise<T>, comment?: string): Promise<T>;

  blocking<T>(promise: Promise<T>, comment?: string): Promise<T>;

  getState(): LoadingManagerState;

  onChange(callback: LoadingManagerStateChangeCallback): void;

  offChange(callback: LoadingManagerStateChangeCallback): void;
}
