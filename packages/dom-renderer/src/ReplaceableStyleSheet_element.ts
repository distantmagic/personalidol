import { MathUtils } from "three/src/math/MathUtils";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { ReplaceableStyleSheet_element as IReplaceableStyleSheet_element } from "./ReplaceableStyleSheet_element.interface";
import type { ReplaceableStyleSheetState } from "./ReplaceableStyleSheetState.type";

export function ReplaceableStyleSheet_element(shadowRoot: ShadowRoot, css: string): IReplaceableStyleSheet_element {
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
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload() {
    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount() {
    state.isMounted = false;
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {}

  return Object.freeze({
    css: css,
    id: MathUtils.generateUUID(),
    isReplaceableStyleSheet_element: true,
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
