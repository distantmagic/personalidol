// @flow

import { default as CacheException } from "./Exception/Cache";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { RuntimeCache as RuntimeCacheInterface } from "../interfaces/RuntimeCache";
import type { RuntimeCacheStoreCallback } from "../types/RuntimeCacheStoreCallback";

export default class RuntimeCache<T> implements RuntimeCacheInterface<T> {
  +cacheMap: Map<string, T>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

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
