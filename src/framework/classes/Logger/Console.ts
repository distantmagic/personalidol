import Logger from "src/framework/classes/Logger";

import { Logger as LoggerInterface } from "src/framework/interfaces/Logger";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { LogSeverityEnum } from "src/framework/types/LogSeverityEnum";

export default class Console extends Logger implements LoggerInterface {
  async log(breadcrumbs: LoggerBreadcrumbs, severity: LogSeverityEnum, message: string): Promise<void> {
    const baseMessage = `${message}\n\nLog entry produced at:\n[${breadcrumbs.asString()}]`;

    if ("debug" === severity) {
      console.debug(`%c${baseMessage}`, "background-color: #222; color: gold");
    } else if ("info" === severity) {
      console.info(`%c${baseMessage}`, "background-color: #222; color: lightskyblue");
    } else {
      console.error(baseMessage);
    }
  }
}
