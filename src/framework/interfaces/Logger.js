// @flow

import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";
import type { LogSeverityEnum } from "../types/LogSeverityEnum";

export interface Logger {
  /**
   * System is unusable.
   */
  emergency(LoggerBreadcrumbs, string): Promise<void>;

  /**
   * Action must be taken immediately.
   *
   * Example: Entire website down, database unavailable, etc. This should
   * trigger the SMS alerts and wake you up.
   */
  alert(LoggerBreadcrumbs, string): Promise<void>;

  /**
   * Critical conditions.
   *
   * Example: Application component unavailable, unexpected exception.
   */
  critical(LoggerBreadcrumbs, string): Promise<void>;

  /**
   * Runtime errors that do not require immediate action but should typically
   * be logged and monitored.
   */
  error(LoggerBreadcrumbs, string): Promise<void>;

  /**
   * Exceptional occurrences that are not errors.
   *
   * Example: Use of deprecated APIs, poor use of an API, undesirable things
   * that are not necessarily wrong.
   */
  warning(LoggerBreadcrumbs, string): Promise<void>;

  /**
   * Normal but significant events.
   */
  notice(LoggerBreadcrumbs, string): Promise<void>;

  /**
   * Interesting events.
   *
   * Example: User logs in, SQL logs.
   */
  info(LoggerBreadcrumbs, string): Promise<void>;

  /**
   * Detailed debug information.
   */
  debug(LoggerBreadcrumbs, string): Promise<void>;

  /**
   * Logs with an arbitrary level.
   */
  log(LoggerBreadcrumbs, LogSeverityEnum, string): Promise<void>;
}
