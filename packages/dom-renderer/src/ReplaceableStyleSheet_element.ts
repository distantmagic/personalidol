import { MathUtils } from "three/src/math/MathUtils";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { ReplaceableStyleSheet as IReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";
import type { ReplaceableStyleSheetState } from "./ReplaceableStyleSheetState.type";

export function ReplaceableStyleSheet_element(shadowRoot: ShadowRoot, css: string): IReplaceableStyleSheet {
  const id = MathUtils.generateUUID();
  const styleElement = document.createElement("style");
  const state: ReplaceableStyleSheetState = Object.seal({
    isMounted: false,
    isDisposed: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
  });

  function dispose() {
    state.isDisposed = true;
  }

  function mount() {
    state.isMounted = true;
    shadowRoot.appendChild(styleElement);
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload() {
    styleElement.setAttribute("id", id);
    styleElement.textContent = css;

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount() {
    state.isMounted = false;
    shadowRoot.removeChild(styleElement);
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {}

  return Object.freeze({
    id: id,
    isScene: true,
    name: "ReplaceableStyleSheet_element",
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
