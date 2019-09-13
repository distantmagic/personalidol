// @flow

import autoBind from "auto-bind";

import Exception from "./Exception";

import type { ExceptionHandler as ExceptionHandlerInterface } from "../interfaces/ExceptionHandler";
import type { Logger } from "../interfaces/Logger";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class ExceptionHandler implements ExceptionHandlerInterface {
  +logger: Logger;

  constructor(logger: Logger) {
    autoBind(this);

    this.logger = logger;
  }

  async captureException(loggerBreadcrumbs: LoggerBreadcrumbs, error: Error): Promise<void> {
    let breadcrumb;

    this.logger.debug(loggerBreadcrumbs, "ExceptionHandler");

    for (breadcrumb of loggerBreadcrumbs.getBreadcrumbs()) {
      this.logger.debug(loggerBreadcrumbs, `${breadcrumb}`);
    }
    if (error instanceof Exception) {
      for (breadcrumb of error.loggerBreadcrumbs.getBreadcrumbs()) {
        this.logger.debug(loggerBreadcrumbs, `${breadcrumb}`);
      }
    }
    this.logger.debug(loggerBreadcrumbs, `${error.message}`);

    const message = [
      "/DD/EXCEPTION_HANDLER:/",
      loggerBreadcrumbs.asString(),
      error instanceof Exception ? "Reported at: " + error.loggerBreadcrumbs.asString() : "",
      error.stack,
    ].join(" ");

    this.logger.error(loggerBreadcrumbs, message);
  }

  expectException(loggerBreadcrumbs: LoggerBreadcrumbs): Error => Promise<void> {
    return (error: Error) => {
      return this.captureException(loggerBreadcrumbs, error);
    };
  }
}
