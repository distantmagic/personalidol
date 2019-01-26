// @flow

import type { Logger as LoggerInterface } from "../interfaces/Logger";
import type { LogSeverityEnum } from "../types/LogSeverityEnum";

export default class SilentLogger implements LoggerInterface {
  emergency(message: string): void {}

  alert(message: string): void {}

  critical(message: string): void {}

  error(message: string): void {}

  warning(message: string): void {}

  notice(message: string): void {}

  info(message: string): void {}

  debug(message: string): void {}

  log(severity: LogSeverityEnum, message: string): void {}
}
