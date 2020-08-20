/// <reference types="@types/css-font-loading-module" />

import { createRouter } from "@personalidol/workers/src/createRouter";
import { notifyLoadingManager } from "@personalidol/loading-manager/src/notifyLoadingManager";

import type { RPCMessage } from "@personalidol/workers/src/RPCMessage.type";

import type { FontPreloadService as IFontPreloadService } from "./FontPreloadService.interface";
import type { FontPreloadParameters } from "./FontPreloadParameters.type";

export function FontPreloadService(fontPreloadMessagePort: MessagePort, progressMessagePort: MessagePort): IFontPreloadService {
  const _messageHandlers = {
    preloadFont: _preloadFont,
  };

  const _messagesRouter = createRouter(_messageHandlers);

  function start() {
    fontPreloadMessagePort.onmessage = _messagesRouter;
  }

  function stop() {
    fontPreloadMessagePort.onmessage = null;
  }

  async function _preloadFont(parameters: FontPreloadParameters & RPCMessage) {
    const loadItemFont = {
      comment: `font ${parameters.family}`,
      id: parameters.rpc,
      weight: 1,
    };

    const fontFace = new FontFace(parameters.family, `url(${parameters.source})`, parameters.descriptors);

    await notifyLoadingManager(progressMessagePort, loadItemFont, fontFace.load());
    document.fonts.add(fontFace);

    fontPreloadMessagePort.postMessage({
      preloadedFont: parameters,
    });
  }

  return Object.freeze({
    name: "FontPreloadService",

    start: start,
    stop: stop,
  });
}
