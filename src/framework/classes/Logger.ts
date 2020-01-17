import autoBind from "auto-bind";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as ILogger } from "src/framework/interfaces/Logger";

import LogSeverityEnum from "src/framework/types/LogSeverityEnum";

export default abstract class Logger implements ILogger {
  abstract log(breadcrumbs: LoggerBreadcrumbs, severity: LogSeverityEnum, message: string): Promise<void>;

  constructor() {
    autoBind(this);
  }

  emergency(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "emergency", message);
  }

  alert(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "alert", message);
  }

  critical(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "critical", message);
  }

  error(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "error", message);
  }

  warning(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "warning", message);
  }

  notice(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "notice", message);
  }

  info(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "info", message);
  }

  debug(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "debug", message);
  }
}
