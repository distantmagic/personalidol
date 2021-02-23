type StyleSheetsCache = {
  [key: string]: CSSStyleSheet;
};

const _styleSheetsCache: StyleSheetsCache = {};

export function createConstructableStylesheet(css: string): CSSStyleSheet {
  if (_styleSheetsCache.hasOwnProperty(css)) {
    return _styleSheetsCache[css];
  }

  const styleSheet = new globalThis.CSSStyleSheet();

  // @ts-ignore
  styleSheet.replaceSync(css);

  _styleSheetsCache[css] = styleSheet;

  return styleSheet;
}
