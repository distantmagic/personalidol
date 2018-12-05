// @flow

import type { LoggerContext } from "./LoggerContext";

export interface LoggerTransport {
  transfer(loggerContext: LoggerContext): void;
}
