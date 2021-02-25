import { MathUtils } from "three/src/math/MathUtils";

import type { i18n } from "i18next";

import type { InternationalizationService as IInternationalizationService } from "./InternationalizationService.interface";
import type { PreloadableState } from "./PreloadableState.type";

export function InternationalizationService(i18next: i18n): IInternationalizationService {
  const state: PreloadableState = Object.seal({
    isPreloaded: false,
    isPreloading: false,
  });

  function _waitForInitialization(): Promise<void> {
    return new Promise(function (resolve) {
      i18next.on("initialized", resolve);
    });
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    if (!i18next.isInitialized) {
      await _waitForInitialization();
    }

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function registerMessagePort(messagePort: MessagePort): void {}

  function start(): void {}

  function stop(): void {}

  return Object.freeze({
    id: MathUtils.generateUUID(),
    i18next: i18next,
    name: "InternationalizationService",
    state: state,

    preload: preload,
    registerMessagePort: registerMessagePort,
    start: start,
    stop: stop,
  });
}
