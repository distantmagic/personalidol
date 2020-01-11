import autoBind from "auto-bind";

import { Logger as LoggerInterface } from "../../interfaces/Logger";
import { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import { LogSeverityEnum } from "../../types/LogSeverityEnum";

export default class Logger implements LoggerInterface {
  constructor() {
    autoBind(this);
  }

  emergency(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "emergency", message);
  }

  alert(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "alert", message);
  }

  critical(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "critical", message);
  }

  error(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "error", message);
  }

  warning(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "warning", message);
  }

  notice(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "notice", message);
  }

  info(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "info", message);
  }

  debug(breadcrumbs: LoggerBreadcrumbs, message: string): Promise<void> {
    return this.log(breadcrumbs, "debug", message);
  }

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
