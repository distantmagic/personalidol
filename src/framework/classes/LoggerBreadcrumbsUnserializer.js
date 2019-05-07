// @flow

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";
import type { LoggerBreadcrumbsUnserializer as LoggerBreadcrumbsUnserializerInterface } from "../interfaces/LoggerBreadcrumbsUnserializer";
import type { LoggerBreadcrumbsSerializedObject } from "../types/LoggerBreadcrumbsSerializedObject";

export default class LoggerBreadcrumbsUnserializer
  implements LoggerBreadcrumbsUnserializerInterface {
  fromJson(serialized: string): LoggerBreadcrumbsInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(
    parsed: LoggerBreadcrumbsSerializedObject
  ): LoggerBreadcrumbsInterface {
    return new LoggerBreadcrumbs(parsed.breadcrumbs);
  }
}
