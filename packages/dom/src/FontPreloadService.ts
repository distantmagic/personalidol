/// <reference types="@types/css-font-loading-module" />

import { createRouter } from "@personalidol/framework/src/createRouter";
import { generateUUID } from "@personalidol/math/src/generateUUID";
import { prefetch } from "@personalidol/framework/src/prefetch";

import type { RPCMessage } from "@personalidol/framework/src/RPCMessage.type";

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
    fontPreloadMessagePort.onmessage = _messagesRouter;
  }

  async function _preloadFont(parameters: FontPreloadParameters & RPCMessage) {
    await prefetch(progressMessagePort, "font", parameters.source);

    const fontFace = new FontFace(parameters.family, `url(${parameters.source})`, parameters.descriptors);

    await fontFace.load();

    document.fonts.add(fontFace);

    fontPreloadMessagePort.postMessage({
      preloadedFont: parameters,
    });
  }

  return Object.freeze({
    id: generateUUID(),
    name: "FontPreloadService",

    start: start,
    stop: stop,
  });
}
