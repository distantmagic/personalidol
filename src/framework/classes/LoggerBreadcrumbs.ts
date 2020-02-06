import { default as ILoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";

const LOGGER_BREADCRUMB_SEPARATOR = "/";

export default class LoggerBreadcrumbs implements ILoggerBreadcrumbs {
  readonly breadcrumbs: ReadonlyArray<string>;
  readonly loggerBreadcrumbsLocalCache: Map<string, ILoggerBreadcrumbs> = new Map<string, ILoggerBreadcrumbs>();
  readonly loggerBreadcrumbsMemo: Map<string, ILoggerBreadcrumbs>;

  constructor(breadcrumbs: ReadonlyArray<string> = [], loggerBreadcrumbsMemo: Map<string, ILoggerBreadcrumbs> = new Map()) {
    this.breadcrumbs = Object.freeze(breadcrumbs);
    this.loggerBreadcrumbsMemo = loggerBreadcrumbsMemo;
  }

  add(breadcrumb: string): ILoggerBreadcrumbs {
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

  addVariable(breadcrumb: string): ILoggerBreadcrumbs {
    // do not memoize this one, variable content may lead to memory leaks
    return new LoggerBreadcrumbs(this.breadcrumbs.concat(`"${breadcrumb}"`));
  }

  asArray(): ReadonlyArray<string> {
    return this.breadcrumbs;
  }

  asString(): string {
    return (
      LOGGER_BREADCRUMB_SEPARATOR +
      this.breadcrumbs
        .map(function(breadcrumb) {
          if (breadcrumb.includes(" ") || breadcrumb.includes(LOGGER_BREADCRUMB_SEPARATOR)) {
            return `"${breadcrumb}"`;
          }

          return breadcrumb;
        })
        .join(LOGGER_BREADCRUMB_SEPARATOR)
    );
  }

  getBreadcrumbs(): ReadonlyArray<string> {
    return this.breadcrumbs;
  }

  isEqual(other: ILoggerBreadcrumbs): boolean {
    return this.asString() === other.asString();
  }
}
