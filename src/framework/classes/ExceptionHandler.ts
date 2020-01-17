import autoBind from "auto-bind";

import ExceptionHandlerFilter from "src/framework/interfaces/ExceptionHandlerFilter";
import Logger from "src/framework/interfaces/Logger";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IExceptionHandler } from "src/framework/interfaces/ExceptionHandler";

export default class ExceptionHandler implements IExceptionHandler {
  readonly exceptionHandlerFilter: ExceptionHandlerFilter;
  readonly logger: Logger;

  static reportId: number = 0;

  constructor(logger: Logger, exceptionHandlerFilter: ExceptionHandlerFilter) {
    autoBind(this);

    this.exceptionHandlerFilter = exceptionHandlerFilter;
    this.logger = logger;
  }

  async captureException(loggerBreadcrumbs: LoggerBreadcrumbs, error: Error): Promise<boolean> {
    if (!this.exceptionHandlerFilter.isCapturable(error)) {
      // nothing important happened
      return false;
    }

    await this.logger.error(loggerBreadcrumbs.add("captureException"), `Report #${ExceptionHandler.reportId}:\n${error.message}\n\nStack trace:\n${error.stack}`);

    ExceptionHandler.reportId += 1;

    return true;
  }
}
