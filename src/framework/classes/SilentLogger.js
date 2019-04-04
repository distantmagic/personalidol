// @flow

import type { Logger as LoggerInterface } from "../interfaces/Logger";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { LogSeverityEnum } from "../types/LogSeverityEnum";

export default class SilentLogger implements LoggerInterface {
  emergency(breadcrumbs: LoggerBreadcrumbs, message: string): void {}

  alert(breadcrumbs: LoggerBreadcrumbs, message: string): void {}

  critical(breadcrumbs: LoggerBreadcrumbs, message: string): void {}

  error(breadcrumbs: LoggerBreadcrumbs, message: string): void {}

  warning(breadcrumbs: LoggerBreadcrumbs, message: string): void {}

  notice(breadcrumbs: LoggerBreadcrumbs, message: string): void {}

  info(breadcrumbs: LoggerBreadcrumbs, message: string): void {}

  debug(breadcrumbs: LoggerBreadcrumbs, message: string): void {}

  log(
    breadcrumbs: LoggerBreadcrumbs,
    severity: LogSeverityEnum,
    message: string
  ): void {}
}
