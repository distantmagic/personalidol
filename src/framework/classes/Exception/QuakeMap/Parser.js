// @flow

import QuakeMap from "../QuakeMap";

import type { LoggerBreadcrumbs } from "../../../interfaces/LoggerBreadcrumbs";

export default class Parser extends QuakeMap {
  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, message: string) {
    super(loggerBreadcrumbs, message);
  }
}
