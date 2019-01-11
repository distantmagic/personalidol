// @flow

import type { LogSeverityEnum } from "../types/LogSeverityEnum";

export interface Logger {
  /**
   * System is unusable.
   */
  emergency(string): void;

  /**
   * Action must be taken immediately.
   *
   * Example: Entire website down, database unavailable, etc. This should
   * trigger the SMS alerts and wake you up.
   */
  alert(string): void;

  /**
   * Critical conditions.
   *
   * Example: Application component unavailable, unexpected exception.
   */
  critical(string): void;

  /**
   * Runtime errors that do not require immediate action but should typically
   * be logged and monitored.
   */
  error(string): void;

  /**
   * Exceptional occurrences that are not errors.
   *
   * Example: Use of deprecated APIs, poor use of an API, undesirable things
   * that are not necessarily wrong.
   */
  warning(string): void;

  /**
   * Normal but significant events.
   */
  notice(string): void;

  /**
   * Interesting events.
   *
   * Example: User logs in, SQL logs.
   */
  info(string): void;

  /**
   * Detailed debug information.
   */
  debug(string): void;

  /**
   * Logs with an arbitrary level.
   */
  log(LogSeverityEnum, string): void;
}
