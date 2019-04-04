// @flow

import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";

export default class LoggerBreadcrumbs implements LoggerBreadcrumbsInterface {
  +breadcrumbs: Array<string>;

  constructor(breadcrumbs: Array<string> = ["root"]) {
    this.breadcrumbs = breadcrumbs;
  }

  add(breadcrumb: string): LoggerBreadcrumbsInterface {
    return new LoggerBreadcrumbs(this.breadcrumbs.concat(breadcrumb));
  }

  asString(): string {
    return this.breadcrumbs.join("/");
  }
}
