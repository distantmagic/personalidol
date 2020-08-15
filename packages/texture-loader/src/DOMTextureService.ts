import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createReusedResponsesCache } from "@personalidol/workers/src/createReusedResponsesCache";
import { createReusedResponsesUsage } from "@personalidol/workers/src/createReusedResponsesUsage";
import { reuseResponse } from "@personalidol/workers/src/reuseResponse";

import type { ReusedResponsesCache } from "@personalidol/workers/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/workers/src/ReusedResponsesUsage.type";

import type { DOMTextureService as IDOMTextureService } from "./DOMTextureService.interface";

type TextureQueueItem = {
  messagePort: MessagePort;
  rpc: string;
  textureUrl: string;
};

const _emptyTransferables: [] = [];
const _loadingCache: ReusedResponsesCache = createReusedResponsesCache();
const _loadingUsage: ReusedResponsesUsage = createReusedResponsesUsage();
const _textureQueue: Array<TextureQueueItem> = [];

const _messagesRouter = {
  createImageBitmap(messagePort: MessagePort, { textureUrl, rpc }: { textureUrl: string; rpc: string }): void {
    _textureQueue.push({
      messagePort: messagePort,
      rpc: rpc,
      textureUrl: textureUrl,
    });
  },
};

export function DOMTextureService(canvas: HTMLCanvasElement, context2D: CanvasRenderingContext2D): IDOMTextureService {
  function registerMessagePort(messagePort: MessagePort) {
    attachMultiRouter(messagePort, _messagesRouter);
  }

  function start() {}

  function stop() {}

  function update() {
    if (_textureQueue.length < 1) {
      return;
    }

    do {
      let request = _textureQueue.shift();

      if (!request) {
        throw new Error("Unexpected empty processing request in the texture queue.");
      }

      _processTextureQueue(request);
    } while (_textureQueue.length > 0);
  }

  async function _createImageData(request: TextureQueueItem): Promise<ImageData> {
    const image: HTMLImageElement = await _preloadImage(request.textureUrl);

    const imageNaturalHeight = image.naturalHeight;
    const imageNaturalWidth = image.naturalWidth;

    canvas.height = imageNaturalHeight;
    canvas.width = imageNaturalWidth;

    // flip image vertically to stay consistent with a 'createImageBitmap'
    // version
    context2D.save();
    context2D.scale(1, -1);

    context2D.drawImage(image, 0, -1 * imageNaturalHeight);

    try {
      return context2D.getImageData(0, 0, imageNaturalWidth, imageNaturalHeight);
    } finally {
      context2D.restore();
    }
  }

  async function _processTextureQueue(request: TextureQueueItem): Promise<void> {
    const { data: imageData, isLast } = await reuseResponse<ImageData, TextureQueueItem>(_loadingCache, _loadingUsage, request, _createImageData);

    request.messagePort.postMessage(
      {
        imageData: {
          imageDataBuffer: imageData.data.buffer,
          imageDataHeight: imageData.height,
          imageDataWidth: imageData.width,
          rpc: request.rpc,
        },
      },
      isLast ? [imageData.data.buffer] : _emptyTransferables
    );
  }

  function _preloadImage(textureUrl: string): Promise<HTMLImageElement> {
    return new Promise(function (resolve, reject) {
      const image = new Image();

      image.onerror = reject;
      image.onload = function () {
        resolve(image);
      };

      image.src = textureUrl;
    });
  }

  return Object.freeze({
    registerMessagePort: registerMessagePort,
    start: start,
    stop: stop,
    update: update,
  });
}
