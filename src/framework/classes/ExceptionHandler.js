// @flow

import autoBind from "auto-bind";

import CancelledException from "./Exception/Cancelled";

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
    if (error instanceof CancelledException) {
      this.logger.warning(breadcrumbs, error.message);
      console.warn(
        "/DD/EXCEPTION_HANDLER:/%s",
        breadcrumbs.asString(),
        error.message,
        error.stack
      );
    } else {
      this.logger.error(breadcrumbs, error.message);
      console.error(
        "/DD/EXCEPTION_HANDLER:/%s",
        breadcrumbs.asString(),
        error.message,
        error.stack
      );
    }
  }
}
