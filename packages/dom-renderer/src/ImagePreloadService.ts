/// <reference types="@types/css-font-loading-module" />

import { createResourceLoadMessage } from "@personalidol/loading-manager/src/createResourceLoadMessage";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { notifyLoadingManager } from "@personalidol/loading-manager/src/notifyLoadingManager";

import { canvas2DDrawImage } from "./canvas2DDrawImage";
import { preloadImage } from "./preloadImage";

import type { RPCMessage } from "@personalidol/workers/src/RPCMessage.type";

import type { ImagePreloadService as IImagePreloadService } from "./ImagePreloadService.interface";
import type { ImagePreloadParameters } from "./ImagePreloadParameters.type";

type PreloadedImages = {
  [key: string]: {
    dataUrl: string;
    image: HTMLImageElement;
    style: HTMLStyleElement;
  };
};

export function ImagePreloadService(
  canvas: HTMLCanvasElement,
  context2D: CanvasRenderingContext2D,
  imagePreloadMessagePort: MessagePort,
  progressMessagePort: MessagePort
): IImagePreloadService {
  const _messageHandlers = {
    preloadImage: _preloadImage,
  };
  const _preloadedImages: PreloadedImages = {};

  const _messagesRouter = createRouter(_messageHandlers);

  function start() {
    imagePreloadMessagePort.onmessage = _messagesRouter;
  }

  function stop() {
    imagePreloadMessagePort.onmessage = null;
  }

  async function _preloadImage(parameters: ImagePreloadParameters & RPCMessage) {
    if (!_preloadedImages.hasOwnProperty(parameters.url)) {
      // Otherwise Image is already preloaded.
      await _preloadStoreImage(parameters);
    }

    imagePreloadMessagePort.postMessage({
      preloadedImage: parameters,
    });
  }

  async function _preloadStoreImage(parameters: ImagePreloadParameters & RPCMessage) {
    // prettier-ignore
    const image = await notifyLoadingManager(
      progressMessagePort,
      createResourceLoadMessage("image", parameters.url),
      preloadImage(parameters.url)
    );

    canvas2DDrawImage(canvas, context2D, image);

    const dataUrl = canvas.toDataURL();
    const style = document.createElement("style");

    style.setAttribute("data-personalidol-image", parameters.url);
    style.textContent = parameters.css.replace("{dataurl}", dataUrl);

    document.body.appendChild(style);

    _preloadedImages[parameters.url] = {
      dataUrl: dataUrl,
      image: image,
      style: style,
    };
  }

  return Object.freeze({
    name: "ImagePreloadService",

    start: start,
    stop: stop,
  });
}
