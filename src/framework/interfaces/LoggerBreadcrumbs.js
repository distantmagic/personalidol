// @flow

import type { Arrayable } from "./Arrayable";
import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";
import type { LoggerBreadcrumbsSerializedObject } from "../types/LoggerBreadcrumbsSerializedObject";
import type { Stringable } from "./Stringable";

export interface LoggerBreadcrumbs
  extends Arrayable<string>,
    Equatable<LoggerBreadcrumbs>,
    JsonSerializable<LoggerBreadcrumbsSerializedObject>,
    Stringable {
  add(breadcrumb: string): LoggerBreadcrumbs;

  addVariable(breadcrumb: string): LoggerBreadcrumbs;

  getBreadcrumbs(): $ReadOnlyArray<string>;
}
