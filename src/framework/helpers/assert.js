// @flow

import Exception from "../classes/Exception";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default function assert<T>(
  loggerBreadcrumbs: LoggerBreadcrumbs,
  maybe: ?T,
  message: string = "Assertion failed."
): T {
  if (!maybe) {
    throw new Exception(loggerBreadcrumbs, message);
  }

  return maybe;
}
