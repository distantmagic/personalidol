import { createConstructableStyleSheetsCache } from "./createConstructableStyleSheetsCache";

import type { ConstructableStyleSheetsCache } from "./ConstructableStyleSheetsCache.type";

const _styleSheetsCache: ConstructableStyleSheetsCache = createConstructableStyleSheetsCache();

export function createConstructableStylesheet(css: string): CSSStyleSheet {
  if (_styleSheetsCache.hasOwnProperty(css)) {
    return _styleSheetsCache[css];
  }

  const styleSheet = new globalThis.CSSStyleSheet();

  // @ts-ignore this is a Chrome only feature at this point and as such it is
  // not typed
  styleSheet.replaceSync(css);

  _styleSheetsCache[css] = styleSheet;

  return styleSheet;
}
