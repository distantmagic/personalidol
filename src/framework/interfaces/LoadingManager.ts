import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

export default interface LoadingManager {
  background<T>(promise: Promise<T>, comment?: string): Promise<T>;

  blocking<T>(promise: Promise<T>, comment?: string): Promise<T>;

  getComments(): ReadonlyArray<string>;

  getTotalEnqueued(): number;

  getTotalFailed(): number;

  getTotalLoaded(): number;

  getTotalLoading(): number;

  /**
   * @return number progress value between 0 and 1
   */
  getProgress(): number;

  isBackgroundLoading(): boolean;

  isBlocking(): boolean;

  isFailed(): boolean;

  isLoading(): boolean;
}
