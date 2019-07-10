// @flow

import type { RuntimeCacheStoreCallback } from "../types/RuntimeCacheStoreCallback";

export interface RuntimeCache<T> {
  get(key: string): T;

  has(key: string): boolean;

  remember(key: string, RuntimeCacheStoreCallback<T>): T;
}
