// @flow

import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";
import type { LoggerBreadcrumbsSerializedObject } from "../types/LoggerBreadcrumbsSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface LoggerBreadcrumbsUnserializer
  extends JsonUnserializable<LoggerBreadcrumbs, LoggerBreadcrumbsSerializedObject> {}
