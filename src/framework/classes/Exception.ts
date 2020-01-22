import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

export default class Exception extends Error implements HasLoggerBreadcrumbs {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, message: string) {
    super(`[${loggerBreadcrumbs.asString()}]\n${message}`);

    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }
}
