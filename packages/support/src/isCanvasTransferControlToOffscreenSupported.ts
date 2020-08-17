import { _getSetCache } from "./_getSetCache";

import type { SupportCache } from "./SupportCache.type";

export const CACHE_KEY = Symbol("canvas.transferControlToOffscreen");

function _check(): boolean {
  if (!globalThis.HTMLCanvasElement) {
    return false;
  }

  return "function" === typeof HTMLCanvasElement.prototype.transferControlToOffscreen;
}

export function isCanvasTransferControlToOffscreenSupported(supportCache: SupportCache): Promise<boolean> {
  return _getSetCache(supportCache, CACHE_KEY, _check);
}
