import autoBind from "auto-bind";

import LogSeverity from "src/framework/enums/LogSeverity";

import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as ILogger } from "src/framework/interfaces/Logger";

export default abstract class Logger implements ILogger {
  abstract log(breadcrumbs: LoggerBreadcrumbs, severity: LogSeverity, message: string): Promise<void>;

  constructor() {
    autoBind(this);
  }

  emergency(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, LogSeverity.Emergency, message);
  }

  alert(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, LogSeverity.Alert, message);
  }

  critical(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, LogSeverity.Critical, message);
  }

  error(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, LogSeverity.Error, message);
  }

  warning(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, LogSeverity.Warning, message);
  }

  notice(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, LogSeverity.Notice, message);
  }

  info(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, LogSeverity.Info, message);
  }

  debug(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, LogSeverity.Debug, message);
  }
}
