// @flow

import type { ExceptionHandlerGuardCallback } from "../types/ExceptionHandlerGuardCallback";
import type { Logger } from "./Logger";
import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface ExceptionHandler {
  /**
   * Should return 'true' when exception is processed successfully.
   */
  captureException<T: Error>(LoggerBreadcrumbs, T): Promise<boolean>;

  guard<T>(LoggerBreadcrumbs, ExceptionHandlerGuardCallback<T>): Promise<T>;
}
