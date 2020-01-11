import { RuntimeCacheStoreCallback } from "../types/RuntimeCacheStoreCallback";

export interface RuntimeCache<T> {
  get(key: string): T;

  has(key: string): boolean;

  remember(key: string, callback: RuntimeCacheStoreCallback<T>): T;
}
