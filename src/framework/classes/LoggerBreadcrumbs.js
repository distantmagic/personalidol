// @flow

import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";

export default class LoggerBreadcrumbs implements LoggerBreadcrumbsInterface {
  +breadcrumbs: Array<string>;
  +loggerBreadcrumbsLocalCache: Map<string, LoggerBreadcrumbsInterface>;
  +loggerBreadcrumbsMemo: Map<string, LoggerBreadcrumbsInterface>;

  constructor(
    breadcrumbs: Array<string> = ["root"],
    loggerBreadcrumbsMemo: Map<string, LoggerBreadcrumbsInterface> = new Map()
  ) {
    this.breadcrumbs = breadcrumbs;
    this.loggerBreadcrumbsLocalCache = new Map<
      string,
      LoggerBreadcrumbsInterface
    >();
    this.loggerBreadcrumbsMemo = loggerBreadcrumbsMemo;
  }

  add(breadcrumb: string): LoggerBreadcrumbsInterface {
    const localCached = this.loggerBreadcrumbsLocalCache.get(breadcrumb);

    if (localCached) {
      return localCached;
    }

    const added = new LoggerBreadcrumbs(
      this.breadcrumbs.concat(breadcrumb),
      this.loggerBreadcrumbsMemo
    );

    const asString = added.asString();
    const memoized = this.loggerBreadcrumbsMemo.get(asString);

    if (memoized) {
      return memoized;
    }

    this.loggerBreadcrumbsLocalCache.set(breadcrumb, added);
    this.loggerBreadcrumbsMemo.set(asString, added);

    return added;
  }

  addVariable(breadcrumb: string): LoggerBreadcrumbsInterface {
    // do not memoize this one, variable content may lead to memory leaks
    return new LoggerBreadcrumbs(this.breadcrumbs.concat(`"${breadcrumb}"`));
  }

  asString(): string {
    return this.breadcrumbs.join("/");
  }

  getBreadcrumbs(): Array<string> {
    return this.breadcrumbs.slice(0);
  }

  isEqual(other: LoggerBreadcrumbsInterface): boolean {
    return this.asString() === other.asString();
  }
}
