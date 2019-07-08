// @flow

import type { Arrayable } from "./Arrayable";
import type { Equatable } from "./Equatable";
import type { Stringable } from "./Stringable";

export interface LoggerBreadcrumbs extends Arrayable<string>, Equatable<LoggerBreadcrumbs>, Stringable {
  add(breadcrumb: string): LoggerBreadcrumbs;

  addVariable(breadcrumb: string): LoggerBreadcrumbs;

  getBreadcrumbs(): $ReadOnlyArray<string>;
}
