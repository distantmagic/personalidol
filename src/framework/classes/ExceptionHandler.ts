import autoBind from "auto-bind";

import { ExceptionHandler as ExceptionHandlerInterface } from "../interfaces/ExceptionHandler";
import { ExceptionHandlerFilter } from "../interfaces/ExceptionHandlerFilter";
import { Logger } from "../interfaces/Logger";
import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class ExceptionHandler implements ExceptionHandlerInterface {
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
