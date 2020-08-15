import { _getSetCache } from "./_getSetCache";

import type { SupportCache } from "./SupportCache.type";

export const CACHE_KEY = Symbol("canvas.transferControlToOffscreen");

export function isCanvasTransferControlToOffscreenSupported(supportCache: SupportCache, helperCanvas: HTMLCanvasElement): Promise<boolean> {
  return _getSetCache(supportCache, CACHE_KEY, function () {
    return "function" === typeof helperCanvas.transferControlToOffscreen;
  });
}
