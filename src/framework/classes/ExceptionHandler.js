// @flow

import autoBind from "auto-bind";

import Exception from "./Exception";

import type { ExceptionHandler as ExceptionHandlerInterface } from "../interfaces/ExceptionHandler";
import type { ExceptionHandlerFilter } from "../interfaces/ExceptionHandlerFilter";
import type { ExceptionHandlerGuardCallback } from "../types/ExceptionHandlerGuardCallback";
import type { Logger } from "../interfaces/Logger";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class ExceptionHandler implements ExceptionHandlerInterface {
  +exceptionHandlerFilter: ExceptionHandlerFilter;
  +logger: Logger;

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

    let breadcrumb;

    await this.logger.debug(loggerBreadcrumbs, "ExceptionHandler");

    for (breadcrumb of loggerBreadcrumbs.getBreadcrumbs()) {
      await this.logger.debug(loggerBreadcrumbs, `${breadcrumb}`);
    }
    if (error instanceof Exception) {
      for (breadcrumb of error.loggerBreadcrumbs.getBreadcrumbs()) {
        await this.logger.debug(loggerBreadcrumbs, `${breadcrumb}`);
      }
    }
    await this.logger.debug(loggerBreadcrumbs, `${error.message}`);

    const message = [
      loggerBreadcrumbs.asString(),
      error instanceof Exception ? "Reported at: " + error.loggerBreadcrumbs.asString() : "",
      error.stack,
    ].join(" ");

    await this.logger.error(loggerBreadcrumbs, message);

    return true;
  }

  async guard<T>(loggerBreadcrumbs: LoggerBreadcrumbs, callback: ExceptionHandlerGuardCallback<T>): Promise<T> {
    try {
      return await callback();
    } catch (err) {
      this.captureException(loggerBreadcrumbs, err);
      throw err;
    }
  }
}
