import Logger from "src/framework/classes/Logger";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as ILogger } from "src/framework/interfaces/Logger";

import LogSeverityEnum from "src/framework/types/LogSeverityEnum";

export default class Silent extends Logger implements ILogger {
  async log(breadcrumbs: LoggerBreadcrumbs, severity: LogSeverityEnum, message: string): Promise<void> {}
}
