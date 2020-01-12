import Logger from "src/framework/classes/Logger";

import { Logger as LoggerInterface } from "src/framework/interfaces/Logger";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { LogSeverityEnum } from "src/framework/types/LogSeverityEnum";

export default class Silent extends Logger implements LoggerInterface {
  async log(breadcrumbs: LoggerBreadcrumbs, severity: LogSeverityEnum, message: string): Promise<void> {}
}
