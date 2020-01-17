import Exception from "src/framework/classes/Exception";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

export default function assert<T>(loggerBreadcrumbs: LoggerBreadcrumbs, maybe: null | T, message: string = "Assertion failed."): T {
  if (!maybe) {
    throw new Exception(loggerBreadcrumbs, message);
  }

  return maybe;
}
