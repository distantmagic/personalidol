// @flow

import autoBind from "auto-bind";

import type { ExceptionHandler as ExceptionHandlerInterface } from "../interfaces/ExceptionHandler";
import type { Logger } from "../interfaces/Logger";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class ExceptionHandler implements ExceptionHandlerInterface {
  +logger: Logger;

  constructor(logger: Logger) {
    autoBind(this);

    this.logger = logger;
  }

  async captureException(
    breadcrumbs: LoggerBreadcrumbs,
    error: Error
  ): Promise<void> {
    const message = [
      "/DD/EXCEPTION_HANDLER:/",
      breadcrumbs.asString(),
      error.stack
    ].join(" ");

    this.logger.error(breadcrumbs, message);
  }

  expectException(breadcrumbs: LoggerBreadcrumbs): Error => Promise<void> {
    return (error: Error) => {
      return this.captureException(breadcrumbs, error);
    };
  }
}
