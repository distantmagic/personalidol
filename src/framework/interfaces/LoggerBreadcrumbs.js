// @flow

import type { Stringable } from "./Stringable";

export interface LoggerBreadcrumbs extends Stringable {
  add(breadcrumb: string): LoggerBreadcrumbs;
}
