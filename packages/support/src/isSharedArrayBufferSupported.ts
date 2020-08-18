import { _getSetCache } from "./_getSetCache";

import type { SupportCache } from "./SupportCache.type";

export const CACHE_KEY = Symbol("SharedArrayBuffer");

function _check(): boolean {
  return "function" === typeof globalThis.SharedArrayBuffer;
}

export function isSharedArrayBufferSupported(supportCache: SupportCache): Promise<boolean> {
  return _getSetCache(supportCache, CACHE_KEY, _check);
}
