// @flow

import CommandBus from "./CommandBus";
import LogMessage from "./Command/LogMessage";

import type {
  Logger as LoggerInterface,
  LogSeverity
} from "../interfaces/Logger";
import type { LoggerContext } from "../interfaces/LoggerContext";
import type { LoggerTransport } from "../interfaces/LoggerTransport";

export default class Logger implements LoggerInterface {
  emergency(context: LoggerContext): void {
    this.log("emergency", context);
  }

  alert(context: LoggerContext): void {
    this.log("alert", context);
  }

  critical(context: LoggerContext): void {
    this.log("critical", context);
  }

  error(context: LoggerContext): void {
    this.log("error", context);
  }

  warning(context: LoggerContext): void {
    this.log("warning", context);
  }

  notice(context: LoggerContext): void {
    this.log("notice", context);
  }

  info(context: LoggerContext): void {
    this.log("info", context);
  }

  debug(context: LoggerContext): void {
    this.log("debug", context);
  }

  log(severity: LogSeverity, context: LoggerContext): void {}
}
