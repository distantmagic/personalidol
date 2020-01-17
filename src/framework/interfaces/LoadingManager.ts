import LoadingManagerState from "src/framework/interfaces/LoadingManagerState";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

import LoadingManagerStateChangeCallback from "src/framework/types/LoadingManagerStateChangeCallback";

export default interface LoadingManager {
  background<T>(promise: Promise<T>, comment?: string): Promise<T>;

  blocking<T>(promise: Promise<T>, comment?: string): Promise<T>;

  getState(): LoadingManagerState;

  onChange(callback: LoadingManagerStateChangeCallback): void;

  offChange(callback: LoadingManagerStateChangeCallback): void;
}
