import type { ReusedResponsesCache } from "./ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "./ReusedResponsesUsage.type";

function _getKey<T, U>(map: Map<T, U>, key: T): U {
  const ret = map.get(key);

  if ("undefined" === typeof ret) {
    throw new Error("Cache map value is unexpectedly undefined.");
  }

  return ret;
}

function _incrementUsage<U>(usage: ReusedResponsesUsage, key: U, value: number): boolean {
  const ret = _getKey(usage, key) + value;

  usage.set(key, ret);

  return ret < 1;
}

export function reuseResponse<T, K = string>(
  cache: ReusedResponsesCache,
  usage: ReusedResponsesUsage,
  key: K,
  requestFactory: (key: K) => Promise<T>
): Promise<{ data: T; isLast: boolean }> {
  if (!cache.has(key)) {
    cache.set(key, requestFactory(key));
    usage.set(key, 0);
  }

  _incrementUsage(usage, key, 1);

  return _getKey(cache, key).then(function (data: T) {
    const isLast = _incrementUsage(usage, key, -1);

    if (isLast) {
      cache.delete(key);
      usage.delete(key);
    }

    return {
      data: data,
      isLast: isLast,
    };
  });
}
