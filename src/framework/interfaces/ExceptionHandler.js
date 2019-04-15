// @flow

import type { Logger } from "./Logger";
import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface ExceptionHandler {
  constructor(Logger): void;

  captureException(LoggerBreadcrumbs, Error): Promise<void>;

  expectException(LoggerBreadcrumbs): Error => Promise<void>;
}
