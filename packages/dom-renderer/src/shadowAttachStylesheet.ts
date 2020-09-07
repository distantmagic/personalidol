type ShadowAttachStylesheet = (shadow: ShadowRoot, css: string) => ShadowRoot;
type StyleElementsCache = {
  [key: string]: HTMLStyleElement;
};
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

export const shadowAttachStylesheet: ShadowAttachStylesheet = (function () {
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

      return function (shadow: ShadowRoot, css: string) {
        // @ts-ignore
        shadow.adoptedStyleSheets = [_createStyleSheet(css)];

        return shadow;
      };
    })();
  }

  return (function () {
    const _styleElementsCache: StyleElementsCache = {};

    function _createStyleSheet(css: string): HTMLStyleElement {
      if (_styleElementsCache.hasOwnProperty(css)) {
        // Style element is already adopted somewere, we need to clone it.
        return _styleElementsCache[css].cloneNode(true) as HTMLStyleElement;
      }

      const styleElement = document.createElement("style");

      styleElement.textContent = css;

      _styleElementsCache[css] = styleElement;

      return styleElement;
    }

    return function (shadow: ShadowRoot, css: string) {
      shadow.appendChild(_createStyleSheet(css));

      return shadow;
    };
  })();
})();
