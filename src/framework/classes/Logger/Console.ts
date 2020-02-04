import Logger from "src/framework/classes/Logger";

import LogSeverity from "src/framework/enums/LogSeverity";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as ILogger } from "src/framework/interfaces/Logger";

export default class Console extends Logger implements ILogger {
  async log(breadcrumbs: LoggerBreadcrumbs, severity: LogSeverity, message: string): Promise<void> {
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
