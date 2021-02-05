import type { ReusedResponse } from "./ReusedResponse.type";
import type { ReusedResponsesCache } from "./ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "./ReusedResponsesUsage.type";

function _getKey<V, K extends string = string>(map: Map<K, V>, key: K): V {
  const ret = map.get(key);

  if ("undefined" === typeof ret) {
    throw new Error("Cache map value is unexpectedly undefined.");
  }

  return ret;
}

function _updateUsage<K extends string = string>(usage: ReusedResponsesUsage, key: K, value: number): boolean {
  const ret = _getKey(usage, key) + value;

  usage.set(key, ret);

  return ret < 1;
}

export function reuseResponse<T, A, K extends string = string>(
  cache: ReusedResponsesCache,
  usage: ReusedResponsesUsage,
  key: K,
  argument: A,
  requestFactory: (arg: A) => Promise<T>
): Promise<ReusedResponse<T>> {
  if (!cache.has(key)) {
    cache.set(key, requestFactory(argument));
    usage.set(key, 0);
  }

  _updateUsage(usage, key, 1);

  return _getKey(cache, key).then(function (data: T) {
    const isLast = _updateUsage(usage, key, -1);

    if (isLast) {
      cache.delete(key);
      usage.delete(key);
    }

    return <ReusedResponse<T>>{
      data: data,
      isLast: isLast,
    };
  });
}
