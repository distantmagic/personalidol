// @flow

import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";

const LOGGER_BREADCRUMB_SEPARATOR = "/";

export default class LoggerBreadcrumbs implements LoggerBreadcrumbsInterface {
  +breadcrumbs: $ReadOnlyArray<string>;
  +loggerBreadcrumbsLocalCache: Map<string, LoggerBreadcrumbsInterface>;
  +loggerBreadcrumbsMemo: Map<string, LoggerBreadcrumbsInterface>;

  constructor(
    breadcrumbs: $ReadOnlyArray<string> = ["root"],
    loggerBreadcrumbsMemo: Map<string, LoggerBreadcrumbsInterface> = new Map()
  ) {
    this.breadcrumbs = breadcrumbs;
    this.loggerBreadcrumbsLocalCache = new Map<string, LoggerBreadcrumbsInterface>();
    this.loggerBreadcrumbsMemo = loggerBreadcrumbsMemo;
  }

  add(breadcrumb: string): LoggerBreadcrumbsInterface {
    const localCached = this.loggerBreadcrumbsLocalCache.get(breadcrumb);

    if (localCached) {
      return localCached;
    }

    const added = new LoggerBreadcrumbs(this.breadcrumbs.concat(breadcrumb), this.loggerBreadcrumbsMemo);

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

  asArray(): $ReadOnlyArray<string> {
    return this.breadcrumbs;
  }

  asString(): string {
    return this.breadcrumbs
      .map(function(breadcrumb) {
        if (breadcrumb.includes(" ") || breadcrumb.includes(LOGGER_BREADCRUMB_SEPARATOR)) {
          return `"${breadcrumb}"`;
        }

        return breadcrumb;
      })
      .join(LOGGER_BREADCRUMB_SEPARATOR);
  }

  getBreadcrumbs(): $ReadOnlyArray<string> {
    return this.breadcrumbs.slice(0);
  }

  isEqual(other: LoggerBreadcrumbsInterface): boolean {
    return this.asString() === other.asString();
  }
}
