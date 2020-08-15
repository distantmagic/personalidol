import type { SupportCache } from "./SupportCache.type";
import type { SupportChecker } from "./SupportChecker.type";

export async function _getSetCache(supportCache: SupportCache, key: Symbol, checker: SupportChecker): Promise<boolean> {
  if (supportCache.has(key)) {
    return true === supportCache.get(key);
  }

  const ret = await checker();

  supportCache.set(key, ret);

  return ret;
}
