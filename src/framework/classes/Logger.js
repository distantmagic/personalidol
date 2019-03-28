// @flow

import autoBind from "auto-bind";

import type { Logger as LoggerInterface } from "../interfaces/Logger";
import type { LogSeverityEnum } from "../types/LogSeverityEnum";

export default class Logger implements LoggerInterface {
  constructor() {
    autoBind(this);
  }

  emergency(message: string): void {
    this.log("emergency", message);
  }

  alert(message: string): void {
    this.log("alert", message);
  }

  critical(message: string): void {
    this.log("critical", message);
  }

  error(message: string): void {
    this.log("error", message);
  }

  warning(message: string): void {
    this.log("warning", message);
  }

  notice(message: string): void {
    this.log("notice", message);
  }

  info(message: string): void {
    this.log("info", message);
  }

  debug(message: string): void {
    this.log("debug", message);
  }

  log(severity: LogSeverityEnum, message: string): void {
    console.log(`[DD] ${severity}: ${message}`);
  }
}
