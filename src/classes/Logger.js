// @flow

import type { Logger as LoggerInterface } from '../interfaces/Logger';
import type { LoggerContext } from '../interfaces/LoggerContext';

export default class Logger implements LoggerInterface {
  emergency(context: LoggerContext): void {
  }

  alert(context: LoggerContext): void {
  }

  critical(context: LoggerContext): void {
  }

  error(context: LoggerContext): void {
  }

  warning(context: LoggerContext): void {
  }

  notice(context: LoggerContext): void {
  }

  info(context: LoggerContext): void {
  }

  debug(context: LoggerContext): void {
  }
}
