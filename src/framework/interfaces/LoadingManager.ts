// @flow strict

import type { LoadingManagerState } from "./LoadingManagerState";
import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";
import type { LoadingManagerStateChangeCallback } from "../types/LoadingManagerStateChangeCallback";

export interface LoadingManager {
  background<T>(Promise<T>, comment?: string): Promise<T>;

  blocking<T>(Promise<T>, comment?: string): Promise<T>;

  getState(): LoadingManagerState;

  onChange(LoadingManagerStateChangeCallback): void;

  offChange(LoadingManagerStateChangeCallback): void;
}
