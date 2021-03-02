/// <reference types="@types/css-font-loading-module" />

import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { Progress } from "@personalidol/loading-manager/src/Progress";

import type { RPCMessage } from "@personalidol/framework/src/RPCMessage.type";
import type { Progress as IProgress } from "@personalidol/loading-manager/src/Progress.interface";

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
    const progress: IProgress = Progress(progressMessagePort, "font", parameters.family);
    const fontFace = new FontFace(parameters.family, `url(${parameters.source})`, parameters.descriptors);

    progress.start();

    await progress.wait(fontFace.load());

    document.fonts.add(fontFace);

    fontPreloadMessagePort.postMessage({
      preloadedFont: parameters,
    });
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "FontPreloadService",

    start: start,
    stop: stop,
  });
}
