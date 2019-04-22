// @flow

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class Exception extends Error {
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, message: string) {
    super(message);

    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }
}
