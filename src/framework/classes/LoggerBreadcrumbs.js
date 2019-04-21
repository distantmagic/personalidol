// @flow

import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";

export default class LoggerBreadcrumbs implements LoggerBreadcrumbsInterface {
  +breadcrumbs: Array<string>;
  +loggerBreadCrumbsMemo: Map<string, LoggerBreadcrumbsInterface>;

  constructor(
    breadcrumbs: Array<string> = ["root"],
    loggerBreadCrumbsMemo: Map<string, LoggerBreadcrumbsInterface> = new Map()
  ) {
    this.breadcrumbs = breadcrumbs;
    this.loggerBreadCrumbsMemo = loggerBreadCrumbsMemo;
  }

  add(breadcrumb: string): LoggerBreadcrumbsInterface {
    const added = new LoggerBreadcrumbs(
      this.breadcrumbs.concat(breadcrumb),
      this.loggerBreadCrumbsMemo
    );

    const asString = added.asString();
    const memoized = this.loggerBreadCrumbsMemo.get(asString);

    if (memoized) {
      return memoized;
    }

    this.loggerBreadCrumbsMemo.set(asString, added);

    return added;
  }

  addVariable(breadcrumb: string): LoggerBreadcrumbsInterface {
    // do not memoize this one, variable content may lead to memory leaks
    return new LoggerBreadcrumbs(this.breadcrumbs.concat(`"${breadcrumb}"`));
  }

  asString(): string {
    return this.breadcrumbs.join("/");
  }

  isEqual(other: LoggerBreadcrumbsInterface): boolean {
    return this.asString() === other.asString();
  }
}
