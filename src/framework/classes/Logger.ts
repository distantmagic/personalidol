import { Logger as LoggerInterface } from "../interfaces/Logger";
import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import { LogSeverityEnum } from "../types/LogSeverityEnum";

export default class Logger implements LoggerInterface {
  async emergency(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {}

  async alert(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {}

  async critical(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {}

  async error(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {}

  async warning(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {}

  async notice(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {}

  async info(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {}

  async debug(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {}

  async log(breadcrumbs: LoggerBreadcrumbs, severity: LogSeverityEnum, message: string): Promise<void> {}
}
