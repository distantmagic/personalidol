/// <reference types="@types/css-font-loading-module" />

import { createRouter } from "@personalidol/workers/src/createRouter";
import { createResourceLoadMessage } from "@personalidol/loading-manager/src/createResourceLoadMessage";
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
    fontPreloadMessagePort.onmessage = _messagesRouter;
  }

  async function _preloadFont(parameters: FontPreloadParameters & RPCMessage) {
    const fontFace = new FontFace(parameters.family, `url(${parameters.source})`, parameters.descriptors);

    // prettier-ignore
    await notifyLoadingManager(
      progressMessagePort,
      createResourceLoadMessage("font", parameters.family),
      fontFace.load()
    );

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
