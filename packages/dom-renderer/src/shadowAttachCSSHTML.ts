type ShadowAttachCSSHTML = (shadow: ShadowRoot, css: string, html: string) => ShadowRoot;
type StyleSheetsCache = {
  [key: string]: CSSStyleSheet;
};

let _isConstructableCSSStyleSheetSupported = (function () {
  if (!ShadowRoot.prototype.hasOwnProperty("adoptedStyleSheets")) {
    return false;
  }

  try {
    const _testSheet = new globalThis.CSSStyleSheet();

    // @ts-ignore
    _testSheet.replaceSync("a{}");
  } catch (e) {
    return false;
  }

  return true;
})();

export const shadowAttachCSSHTML: ShadowAttachCSSHTML = (function () {
  if (_isConstructableCSSStyleSheetSupported) {
    return (function () {
      const _styleSheetsCache: StyleSheetsCache = {};

      function _createStyleSheet(css: string): CSSStyleSheet {
        if (_styleSheetsCache.hasOwnProperty(css)) {
          return _styleSheetsCache[css];
        }

        const styleSheet = new globalThis.CSSStyleSheet();

        // @ts-ignore
        styleSheet.replaceSync(css);

        _styleSheetsCache[css] = styleSheet;

        return styleSheet;
      }

      return function (shadow: ShadowRoot, css: string, html: string) {
        // @ts-ignore
        shadow.adoptedStyleSheets = [_createStyleSheet(css)];

        shadow.innerHTML = html;

        return shadow;
      };
    })();
  }

  return function (shadow: ShadowRoot, css: string, html: string) {
    shadow.innerHTML = `
      <style>${css}</style>
      ${html}
    `;

    return shadow;
  };
})();
