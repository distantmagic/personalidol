import type LogSeverity from "src/framework/enums/LogSeverity";

import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

export default interface Logger {
  /**
   * System is unusable.
   */
  emergency(loggerBreadcrumbs: LoggerBreadcrumbs, message: string): Promise<void>;

  /**
   * Action must be taken immediately.
   *
   * Example: Entire website down, database unavailable, etc. This should
   * trigger the SMS alerts and wake you up.
   */
  alert(loggerBreadcrumbs: LoggerBreadcrumbs, message: string): Promise<void>;

  /**
   * Critical conditions.
   *
   * Example: Application component unavailable, unexpected exception.
   */
  critical(loggerBreadcrumbs: LoggerBreadcrumbs, message: string): Promise<void>;

  /**
   * Runtime errors that do not require immediate action but should typically
   * be logged and monitored.
   */
  error(loggerBreadcrumbs: LoggerBreadcrumbs, message: string): Promise<void>;

  /**
   * Exceptional occurrences that are not errors.
   *
   * Example: Use of deprecated APIs, poor use of an API, undesirable things
   * that are not necessarily wrong.
   */
  warning(loggerBreadcrumbs: LoggerBreadcrumbs, message: string): Promise<void>;

  /**
   * Normal but significant events.
   */
  notice(loggerBreadcrumbs: LoggerBreadcrumbs, message: string): Promise<void>;

  /**
   * Interesting events.
   *
   * Example: User logs in, SQL logs.
   */
  info(loggerBreadcrumbs: LoggerBreadcrumbs, message: string): Promise<void>;

  /**
   * Detailed debug information.
   */
  debug(loggerBreadcrumbs: LoggerBreadcrumbs, message: string): Promise<void>;

  /**
   * Logs with an arbitrary level.
   */
  log(loggerBreadcrumbs: LoggerBreadcrumbs, severity: LogSeverity, message: string): Promise<void>;
}
