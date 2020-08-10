import { MathUtils } from "three/src/math/MathUtils";

import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { createRPCLookupTable } from "@personalidol/workers/src/createRPCLookupTable";
import { handleRPCResponse } from "@personalidol/workers/src/handleRPCResponse";
import { reuseResponse } from "@personalidol/workers/src/reuseResponse";

import { requestTexture } from "./requestTexture";

import type { ReusedResponsesCache } from "@personalidol/workers/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/workers/src/ReusedResponsesUsage.type";
import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";

import type { AtlasService as IAtlasService } from "./AtlasService.interface";
import type { ImageBitmapResponse } from "./ImageBitmapResponse.type";
import type { ImageDataBufferResponse } from "./ImageDataBufferResponse.type";

type AtlasQueueItem = {
  messagePort: MessagePort;
  rpc: string;
  textureUrls: ReadonlyArray<string>;
};

const _atlasQueue: Array<AtlasQueueItem> = [];
const _emptyTransferables: [] = [];
const _loadingCache: ReusedResponsesCache = {};
const _loadingUsage: ReusedResponsesUsage = {};
const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();

const _messagesRouter = {
  createTextureAtlas(messagePort: MessagePort, { textureUrls, rpc }: { rpc: string; textureUrls: Array<string> }): void {
    if (textureUrls.length < 1) {
      throw new Error("Can't create texture atlas from 0 textures.");
    }

    _atlasQueue.push({
      messagePort: messagePort,
      rpc: rpc,
      textureUrls: textureUrls.sort(),
    });
  },
};

const _texturesMessageRouter = createRouter({
  imageBitmap: handleRPCResponse<ImageBitmapResponse, void>(_rpcLookupTable, _onImageBitmap),

  imageData: handleRPCResponse<ImageDataBufferResponse, void>(_rpcLookupTable, _onImageDataBuffer),
});

function _getAtlasSideLength(itemsNumber: number): number {
  if (itemsNumber < 1) {
    throw new Error("Can't create texture atlas from 0 textures.");
  }

  return Math.pow(2, Math.ceil(Math.log2(itemsNumber) / 2 + 1) - 1);
}

function _onImageBitmap({ imageBitmap }: ImageBitmapResponse): ImageBitmap {
  return imageBitmap;
}

function _onImageDataBuffer({ imageDataBuffer, imageDataHeight, imageDataWidth }: ImageDataBufferResponse) {
  return new ImageData(new Uint8ClampedArray(imageDataBuffer), imageDataWidth, imageDataHeight);
}

export function AtlasService(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  context2D: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  texturesMessagePort: MessagePort
): IAtlasService {
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
    if (_atlasQueue.length < 1) {
      return;
    }

    do {
      const request = _atlasQueue.shift();

      if (!request) {
        throw new Error("Unexpected empty processing request in the atlas queue.");
      }

      _processAtlasQueue(request);
    } while (_atlasQueue.length > 0);
  }

  /**
   * Textures must be the same size and have other constraints, because I
   * didn't want to go into texture packing / optimization algorithms. Packing
   * everything into the POT square is enough here.
   */
  async function _createTextureAtlas(request: AtlasQueueItem): Promise<ImageData> {
    const textures = await Promise.all(request.textureUrls.map(_requestTexture));

    const textureSize = textures[0].height;
    const width = textures[0].width;

    if (textureSize !== width) {
      throw new Error("Texture sides must be of equal length.");
    }

    if (!MathUtils.isPowerOfTwo(textureSize)) {
      throw new Error("Texture size must be a power of two.");
    }

    let i = 0;

    for (i = 0; i < textures.length; i += 1) {
      if (textures[i].height !== textureSize && textures[i].width !== width) {
        throw new Error(
          `All textures must be of equal size. "${request.textureUrls[i]}" stands out with "${textures[i].width}x${textures[i].height}" vs "${width}x${textureSize}".`
        );
      }
    }

    const atlasSideLength = _getAtlasSideLength(textures.length);
    const atlasSideLengthPx = atlasSideLength * textureSize;

    canvas.height = atlasSideLengthPx;
    canvas.width = atlasSideLengthPx;

    // Reset canvas to pure black first to remove previous textures.
    context2D.clearRect(0, 0, atlasSideLengthPx, atlasSideLengthPx);

    i = 0;

    for (let x = 0; x < atlasSideLength; x += 1) {
      for (let y = 0; y < atlasSideLength; y += 1) {
        if (i >= textures.length) {
          break;
        }

        const texture = textures[i];

        // Both cases need to be handled because of browser support.
        if (texture instanceof ImageBitmap) {
          // prettier-ignore
          context2D.drawImage(
            texture,

            0, 0,
            textureSize, textureSize,

            x * textureSize, y * textureSize,
            textureSize, textureSize
          );
        } else if (texture instanceof ImageData) {
          // prettier-ignore
          context2D.putImageData(
            texture,

            x * textureSize, y * textureSize,
            0, 0,
            textureSize, textureSize
          );
          console.log(x, y, request.textureUrls[i], textures[i]);
        } else {
          throw new Error("Unknown texture data type.");
        }

        i += 1;
      }
    }

    return context2D.getImageData(0, 0, atlasSideLengthPx, atlasSideLengthPx);
  }

  async function _processAtlasQueue(request: AtlasQueueItem): Promise<void> {
    const key = request.textureUrls.join();

    const { data: imageData, isLast } = await reuseResponse<ImageData>(_loadingCache, _loadingUsage, key, function () {
      return _createTextureAtlas(request);
    });

    console.log(request, isLast, imageData);

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

  function _requestTexture(textureUrl: string): Promise<ImageBitmap | ImageData> {
    return requestTexture(_rpcLookupTable, texturesMessagePort, textureUrl);
  }

  return Object.freeze({
    registerMessagePort: registerMessagePort,
    start: start,
    stop: stop,
    update: update,
  });
}
