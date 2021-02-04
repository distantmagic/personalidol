import { MathUtils } from "three/src/math/MathUtils";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { ReplaceableStyleSheet as IReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";
import type { ReplaceableStyleSheetState } from "./ReplaceableStyleSheetState.type";

type StyleSheetsCache = {
  [key: string]: CSSStyleSheet;
};

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

export function ReplaceableStyleSheet_constructable(shadowRoot: ShadowRoot, css: string): IReplaceableStyleSheet {
  const state: ReplaceableStyleSheetState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  function dispose() {
    state.isDisposed = true;
  }

  function mount() {
    state.isMounted = true;

    // @ts-ignore
    shadowRoot.adoptedStyleSheets = [_createStyleSheet(css)];
  }

  async function preload() {
    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount() {
    state.isMounted = false;

    // @ts-ignore
    shadowRoot.adoptedStyleSheets = [];
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {}

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isScene: true,
    isView: false,
    name: "ReplaceableStyleSheet_constructable",
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
  });
}
