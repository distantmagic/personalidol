// @flow

import type { LoggerContext } from './LoggerContext';

export interface Logger {
  /**
   * System is unusable.
   */
  emergency(context: LoggerContext): void;

  /**
   * Action must be taken immediately.
   *
   * Example: Entire website down, database unavailable, etc. This should
   * trigger the SMS alerts and wake you up.
   */
  alert(context: LoggerContext): void;

  /**
   * Critical conditions.
   *
   * Example: Application component unavailable, unexpected exception.
   */
  critical(context: LoggerContext): void;

  /**
   * Runtime errors that do not require immediate action but should typically
   * be logged and monitored.
   */
  error(context: LoggerContext): void;

  /**
   * Exceptional occurrences that are not errors.
   *
   * Example: Use of deprecated APIs, poor use of an API, undesirable things
   * that are not necessarily wrong.
   */
  warning(context: LoggerContext): void;

  /**
   * Normal but significant events.
   */
  notice(context: LoggerContext): void;

  /**
   * Interesting events.
   *
   * Example: User logs in, SQL logs.
   */
  info(context: LoggerContext): void;

  /**
   * Detailed debug information.
   */
  debug(context: LoggerContext): void;
}
