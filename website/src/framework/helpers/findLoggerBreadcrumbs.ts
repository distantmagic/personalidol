import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

export default function findLoggerBreadcrumbs(object: Object, defaultBreadcrumbs?: LoggerBreadcrumbs): LoggerBreadcrumbs {
  const loggerBreadcrumbs = (object as HasLoggerBreadcrumbs).loggerBreadcrumbs;

  if (loggerBreadcrumbs) {
    return loggerBreadcrumbs;
  }

  if (defaultBreadcrumbs) {
    return defaultBreadcrumbs;
  }

  throw new Error("Could not find LoggerBreadcrumbs.");
}
