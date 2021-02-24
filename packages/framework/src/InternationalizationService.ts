import { MathUtils } from "three/src/math/MathUtils";

import type { i18n } from "i18next";

import type { InternationalizationService as IInternationalizationService } from "./InternationalizationService.interface";
import type { PreloadableState } from "./PreloadableState.type";

export function InternationalizationService(i18next: i18n): IInternationalizationService {
  const state: PreloadableState = Object.seal({
    isPreloaded: false,
    isPreloading: false,
  });

  function preload(): void {
    state.isPreloading = true;

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function start(): void {}

  function stop(): void {}

  return Object.freeze({
    id: MathUtils.generateUUID(),
    i18next: i18next,
    name: "InternationalizationService",
    state: state,

    preload: preload,
    start: start,
    stop: stop,
  });
}
