import type { SupportCache } from "./SupportCache.type";
import type { SupportChecker } from "./SupportChecker.type";

export async function _getSetCache(supportCache: SupportCache, key: Symbol, checker: SupportChecker): Promise<boolean> {
  if (supportCache.hasOwnProperty(key)) {
    return supportCache[key];
  }

  supportCache[key] = await checker();

  return supportCache[key];
}
