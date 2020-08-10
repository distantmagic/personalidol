import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { createRPCLookupTable } from "@personalidol/workers/src/createRPCLookupTable";
import { handleRPCResponse } from "@personalidol/workers/src/handleRPCResponse";

import { requestTexture } from "./requestTexture";

import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";

import type { AtlasService as IAtlasService } from "./AtlasService.interface";
import type { ImageBitmapResponse } from "./ImageBitmapResponse.type";
import type { ImageDataBufferResponse } from "./ImageDataBufferResponse.type";

type AtlasQueueItem = {
  messagePort: MessagePort;
  rpc: string;
  textureUrls: ReadonlyArray<string>;
};

const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();
const _atlasQueue: Array<AtlasQueueItem> = [];

const _messagesRouter = {
  createTextureAtlas(messagePort: MessagePort, { textureUrls, rpc }: { rpc: string; textureUrls: ReadonlyArray<string> }): void {
    _atlasQueue.push({
      messagePort: messagePort,
      rpc: rpc,
      textureUrls: textureUrls,
    });
  },
};

export function AtlasService(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  context2D: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  texturesMessagePort: MessagePort
): IAtlasService {
  let _currentRequest: null | AtlasQueueItem = null;

  const _texturesMessageRouter = createRouter({
    imageBitmap: handleRPCResponse<ImageBitmapResponse, void>(_rpcLookupTable, _onImageBitmap),

    imageData: handleRPCResponse<ImageDataBufferResponse, void>(_rpcLookupTable, _onImageDataBuffer),
  });

  function registerMessagePort(messagePort: MessagePort) {
    attachMultiRouter(messagePort, _messagesRouter);
  }

  function start() {
    texturesMessagePort.onmessage = _texturesMessageRouter;
  }

  function stop() {
    texturesMessagePort.onmessage = null;
  }

  function update() {
    if (_atlasQueue.length < 1 || _currentRequest) {
      return;
    }

    const request = _atlasQueue.shift();

    if (!request) {
      throw new Error("Unexpected empty processing request in the atlas queue.");
    }

    _currentRequest = request;
    _createTetxureAtlas(request);
  }

  function _createTetxureAtlas(request: AtlasQueueItem): void {
    console.log("ATLAS REQUEST", request.textureUrls);

    for (let textureUrl of request.textureUrls) {
      requestTexture(_rpcLookupTable, texturesMessagePort, textureUrl);
    }
  }

  function _onImageBitmap({ imageBitmap }: ImageBitmapResponse) {
    console.log(imageBitmap);
  }

  function _onImageDataBuffer({ imageDataBuffer, imageNaturalHeight, imageNaturalWidth }: ImageDataBufferResponse) {
    const imageData = new ImageData(new Uint8ClampedArray(imageDataBuffer), imageNaturalWidth, imageNaturalHeight);

    console.log(imageData);
  }

  return Object.freeze({
    registerMessagePort: registerMessagePort,
    start: start,
    stop: stop,
    update: update,
  });
}
