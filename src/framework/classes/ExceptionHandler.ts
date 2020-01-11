// @flow strict

import autoBind from "auto-bind";

import type { ExceptionHandler as ExceptionHandlerInterface } from "../interfaces/ExceptionHandler";
import type { ExceptionHandlerFilter } from "../interfaces/ExceptionHandlerFilter";
import type { Logger } from "../interfaces/Logger";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class ExceptionHandler implements ExceptionHandlerInterface {
  +exceptionHandlerFilter: ExceptionHandlerFilter;
  +logger: Logger;

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
