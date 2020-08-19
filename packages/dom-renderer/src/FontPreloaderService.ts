/// <reference types="@types/css-font-loading-module" />

import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { notifyLoadingManager } from "@personalidol/loading-manager/src/notifyLoadingManager";

import type { FontPreloaderService as IFontPreloaderService } from "./FontPreloaderService.interface";
import type { FontPreloadParameters } from "./FontPreloadParameters.type";

export function FontPreloaderService(fontPreloaderMessagePort: MessagePort, progressMessagePort: MessagePort): IFontPreloaderService {
  const _messageHandlers = {
    preload: _preloadFont,
  };

  const _messagesRouter = createRouter(_messageHandlers);

  function start() {
    fontPreloaderMessagePort.onmessage = _messagesRouter;
  }

  function stop() {
    fontPreloaderMessagePort.onmessage = null;
  }

  async function _preloadFont(parameters: FontPreloadParameters) {
    const loadItemFont = {
      comment: `font ${parameters.family}`,
      id: MathUtils.generateUUID(),
      weight: 1,
    };

    const fontFace = new FontFace(parameters.family, `url(${parameters.source})`, parameters.descriptors);

    await notifyLoadingManager(progressMessagePort, loadItemFont, fontFace.load());
    document.fonts.add(fontFace);

    fontPreloaderMessagePort.postMessage({
      preloaded: parameters,
    });
  }

  return Object.freeze({
    name: "FontPreloaderService",

    start: start,
    stop: stop,
  });
}
