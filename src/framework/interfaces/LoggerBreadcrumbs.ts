import { Arrayable } from "./Arrayable";
import { Equatable } from "./Equatable";
import { Stringable } from "./Stringable";

export interface LoggerBreadcrumbs extends Arrayable<string>, Equatable<LoggerBreadcrumbs>, Stringable {
  add(breadcrumb: string): LoggerBreadcrumbs;

  addVariable(breadcrumb: string): LoggerBreadcrumbs;

  getBreadcrumbs(): ReadonlyArray<string>;
}
