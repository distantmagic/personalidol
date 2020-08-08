import { createRouter } from "@personalidol/workers/src/createRouter";

import type { DOMTextureService as IDOMTextureService } from "./DOMTextureService.interface";

export function DOMTextureService(canvas: HTMLCanvasElement, context2D: CanvasRenderingContext2D, messagePort: MessagePort): IDOMTextureService {
  const _textureQueue: Array<{
    image: HTMLImageElement;
    rpc: string;
  }> = [];
  const messagesRouter = createRouter({
    loadImageBitmap({ textureUrl, rpc }: { textureUrl: string; rpc: string }): void {
      const detachedImage = new Image();

      detachedImage.onload = function () {
        _textureQueue.push({
          image: detachedImage,
          rpc: rpc,
        });
      };
      detachedImage.src = textureUrl;
    },
  });

  function start() {
    messagePort.onmessage = messagesRouter;
  }

  function stop() {
    messagePort.onmessage = null;
  }

  function update() {
    if (_textureQueue.length < 1) {
      return;
    }

    const request = _textureQueue.shift();

    if (!request) {
      throw new Error("Unexpected empty processing request in the texture processing queue.");
    }

    const imageNaturalHeight = request.image.naturalHeight;
    const imageNaturalWidth = request.image.naturalWidth;

    canvas.height = imageNaturalHeight;
    canvas.width = imageNaturalWidth;
    context2D.drawImage(request.image, 0, 0, imageNaturalWidth, imageNaturalHeight);

    const imageData = context2D.getImageData(0, 0, imageNaturalWidth, imageNaturalHeight);

    messagePort.postMessage(
      {
        imageData: {
          imageDataBuffer: imageData.data.buffer,
          imageNaturalHeight: imageNaturalHeight,
          imageNaturalWidth: imageNaturalWidth,
          rpc: request.rpc,
        },
      },
      [imageData.data.buffer]
    );
  }

  return Object.freeze({
    start: start,
    stop: stop,
    update: update,
  });
}
