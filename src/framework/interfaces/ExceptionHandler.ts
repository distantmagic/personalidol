import { Logger } from "./Logger";
import { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface ExceptionHandler {
  /**
   * Should return 'true' when exception is processed successfully.
   */
  captureException<T extends Error>(loggerBreadcrumbs: LoggerBreadcrumbs, error: T): Promise<boolean>;
}
