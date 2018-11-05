// @flow

import Command from '../../classes/Command';

import type { LogSeverity } from '../../interfaces/Logger';
import type { LoggerContext } from '../../interfaces/LoggerContext';

export default class LogMessage extends Command {
  loggerContext: LoggerContext;
  severity: LogSeverity;

  constructor(severity: LogSeverity, loggerContext: LoggerContext) {
    super();

    this.loggerContext = loggerContext;
    this.severity = severity;
  }
}
