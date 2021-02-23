let _isTested: boolean = false;
let _isConstructableCSSStyleSheetSupported: boolean = false;

function _test(): boolean {
  if (!ShadowRoot.prototype.hasOwnProperty("adoptedStyleSheets")) {
    return false;
  }

  // @ts-ignore this is a chrome-only feature at this point and as such it is
  // not typed
  if ("function" !== typeof globalThis.CSSStyleSheet.prototype.replaceSync) {
    return false;
  }

  try {
    const _testSheet = new globalThis.CSSStyleSheet();

    // @ts-ignore same as above
    _testSheet.replaceSync("a{}");
  } catch (e) {
    return false;
  }

  return true;
}

export function isConstructableCSSStyleSheetSupported(): boolean {
  if (_isTested) {
    return _isConstructableCSSStyleSheetSupported;
  }

  _isConstructableCSSStyleSheetSupported = _test();
  _isTested = true;

  return _isConstructableCSSStyleSheetSupported;
}
