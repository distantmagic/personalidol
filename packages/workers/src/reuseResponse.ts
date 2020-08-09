import type { ReusedResponsesCache } from "./ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "./ReusedResponsesUsage.type";

export function reuseResponse<T, K extends string>(
  cache: ReusedResponsesCache,
  usage: ReusedResponsesUsage,
  key: K,
  requestFactory: (key: K) => Promise<T>
): Promise<{ data: T; isLast: boolean }> {
  if (!cache.hasOwnProperty(key)) {
    cache[key] = requestFactory(key);
    usage[key] = 0;
  }

  usage[key] += 1;

  return cache[key].then(function (data: T) {
    usage[key] -= 1;

    const isLast = usage[key] < 1;

    if (isLast) {
      delete cache[key];
      delete usage[key];
    }

    return {
      data: data,
      isLast: isLast,
    };
  });
}
