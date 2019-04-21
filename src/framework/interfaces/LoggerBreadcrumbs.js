// @flow

import type { Equatable } from "./Equatable";
import type { Stringable } from "./Stringable";

export interface LoggerBreadcrumbs
  extends Equatable<LoggerBreadcrumbs>,
    Stringable {
  add(breadcrumb: string): LoggerBreadcrumbs;

  addVariable(breadcrumb: string): LoggerBreadcrumbs;
}
