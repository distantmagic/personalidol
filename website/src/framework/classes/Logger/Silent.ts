import Logger from "src/framework/classes/Logger";

import type LogSeverity from "src/framework/enums/LogSeverity";

import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as ILogger } from "src/framework/interfaces/Logger";

export default class Silent extends Logger implements ILogger {
  async log(breadcrumbs: LoggerBreadcrumbs, severity: LogSeverity, message: string): Promise<void> {}
}
