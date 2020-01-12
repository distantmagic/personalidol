import { default as CacheException } from "src/framework/classes/Exception/Cache";

import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { RuntimeCache as RuntimeCacheInterface } from "src/framework/interfaces/RuntimeCache";
import { RuntimeCacheStoreCallback } from "src/framework/types/RuntimeCacheStoreCallback";

export default class RuntimeCache<T> implements RuntimeCacheInterface<T> {
  readonly cacheMap: Map<string, T>;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.cacheMap = new Map<string, T>();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  get(key: string): T {
    const stored = this.cacheMap.get(key);

    if (!stored) {
      throw new CacheException(this.loggerBreadcrumbs.add("get"), `Requested item is not stored in cache: "${key}"`);
    }

    return stored;
  }

  has(key: string): boolean {
    return this.cacheMap.has(key);
  }

  remember(key: string, storeCallback: RuntimeCacheStoreCallback<T>): T {
    if (this.has(key)) {
      return this.get(key);
    }

    const value = storeCallback();

    this.cacheMap.set(key, value);

    return value;
  }
}
