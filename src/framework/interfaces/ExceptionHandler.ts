// @flow strict

import type { Logger } from "./Logger";
import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface ExceptionHandler {
  /**
   * Should return 'true' when exception is processed successfully.
   */
  captureException<T: Error>(LoggerBreadcrumbs, T): Promise<boolean>;
}
