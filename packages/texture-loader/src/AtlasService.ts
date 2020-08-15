import { MathUtils } from "three/src/math/MathUtils";

import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createReusedResponsesCache } from "@personalidol/workers/src/createReusedResponsesCache";
import { createReusedResponsesUsage } from "@personalidol/workers/src/createReusedResponsesUsage";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { createRPCLookupTable } from "@personalidol/workers/src/createRPCLookupTable";
import { handleRPCResponse } from "@personalidol/workers/src/handleRPCResponse";
import { reuseResponse } from "@personalidol/workers/src/reuseResponse";

import { imageDataBufferResponseToImageData } from "./imageDataBufferResponseToImageData";
import { isImageBitmap } from "./isImageBitmap";
import { isImageData } from "./isImageData";
import { requestTexture } from "./requestTexture";

import type { ReusedResponsesCache } from "@personalidol/workers/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/workers/src/ReusedResponsesUsage.type";
import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";

import type { Atlas } from "./Atlas.type";
import type { AtlasService as IAtlasService } from "./AtlasService.interface";
import type { AtlasTextureDimension } from "./AtlasTextureDimension.type";
import type { AtlasTextureDimensions } from "./AtlasTextureDimensions.type";
import type { ImageBitmapResponse } from "./ImageBitmapResponse.type";
import type { ImageDataBufferResponse } from "./ImageDataBufferResponse.type";

type AtlasQueueItem = {
  messagePort: MessagePort;
  rpc: string;
  textureUrls: ReadonlyArray<string>;
};

type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

const _atlasQueue: Array<AtlasQueueItem> = [];
const _emptyTransferables: [] = [];
const _loadingCache: ReusedResponsesCache = createReusedResponsesCache();
const _loadingUsage: ReusedResponsesUsage = createReusedResponsesUsage();
const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();

const _messagesRouter = {
  createTextureAtlas(messagePort: MessagePort, { textureUrls, rpc }: { rpc: string; textureUrls: ReadonlyArray<string> }): void {
    if (textureUrls.length < 1) {
      throw new Error("Can't create texture atlas from 0 textures.");
    }

    _atlasQueue.push({
      messagePort: messagePort,
      rpc: rpc,
      textureUrls: textureUrls,
    });
  },
};

const _texturesMessageRouter = createRouter({
  imageBitmap: handleRPCResponse<ImageBitmapResponse, void>(_rpcLookupTable, _onImageBitmap),

  imageData: handleRPCResponse<ImageDataBufferResponse, void>(_rpcLookupTable, imageDataBufferResponseToImageData),
});

/**
 * Both cases (ImageBitmap and ImageData) need to be handled because of browser
 * support. Texture might be coming either from a texture worker which uses
 * `createImageData` or from the DOM service that uses another canvas to draw
 * an image.
 *
 * @see requestTexture
 */
function _drawAtlasTexture(context2D: Context2D, atlasSideLengthPx: number, texture: ImageBitmap | ImageData, textureDimension: AtlasTextureDimension): void {
  if (isImageBitmap(texture)) {
    // prettier-ignore
    context2D.drawImage(
      texture,

      0, 0,
      textureDimension.width, textureDimension.height,

      textureDimension.atlasLeft, textureDimension.atlasTop - atlasSideLengthPx,
      textureDimension.width, textureDimension.height
    );

    return;
  }

  if (isImageData(texture)) {
    console.log("IMAGE DATA");
    // prettier-ignore
    context2D.putImageData(
      texture,

      textureDimension.atlasLeft, textureDimension.atlasTop,

      0, 0,
      textureDimension.width, textureDimension.height
    );

    return;
  }

  throw new Error("Unknown image type.");
}

function _getAtlasSideLength(itemsNumber: number): number {
  if (itemsNumber < 1) {
    throw new Error("Can't create texture atlas from 0 textures.");
  }

  return Math.pow(2, Math.ceil(Math.log2(itemsNumber) / 2 + 1) - 1);
}

function _keyFromAtlasQueueItem(atlasQueueItem: AtlasQueueItem): string {
  return atlasQueueItem.textureUrls.join();
}

function _onImageBitmap({ imageBitmap }: ImageBitmapResponse): ImageBitmap {
  return imageBitmap;
}

export function AtlasService(canvas: HTMLCanvasElement | OffscreenCanvas, context2D: Context2D, texturesMessagePort: MessagePort): IAtlasService {
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
  async function _createTextureAtlas(request: AtlasQueueItem): Promise<Atlas> {
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

    context2D.scale(1, -1);

    i = 0;

    const textureDimensions: AtlasTextureDimensions = {};

    for (let y = 0; y < atlasSideLength; y += 1) {
      for (let x = 0; x < atlasSideLength; x += 1) {
        if (i >= textures.length) {
          break;
        }

        const texture = textures[i];

        const atlasLeft = x * textureSize;
        const atlasTop = y * textureSize;

        const textureDimension: AtlasTextureDimension = {
          atlasLeft: atlasLeft,
          atlasTop: atlasTop,
          height: textureSize,
          width: textureSize,

          uvStartU: atlasLeft / atlasSideLengthPx,
          uvStopU: (atlasLeft + textureSize) / atlasSideLengthPx,

          uvStartV: atlasTop / atlasSideLengthPx,
          uvStopV: (atlasTop + textureSize) / atlasSideLengthPx,
        };

        const textureUrl = request.textureUrls[i];

        textureDimensions[textureUrl] = textureDimension;

        _drawAtlasTexture(context2D, atlasSideLengthPx, texture, textureDimension);

        i += 1;
      }
    }

    try {
      return {
        imageData: context2D.getImageData(0, 0, atlasSideLengthPx, atlasSideLengthPx),
        textureDimensions: textureDimensions,
      };
    } finally {
      context2D.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  async function _processAtlasQueue(request: AtlasQueueItem): Promise<void> {
    const { data: response, isLast } = await reuseResponse<Atlas, AtlasQueueItem>(_loadingCache, _loadingUsage, _keyFromAtlasQueueItem(request), request, _createTextureAtlas);
    const { imageData, textureDimensions } = response;

    request.messagePort.postMessage(
      {
        textureAtlas: {
          imageDataBuffer: imageData.data.buffer,
          imageDataHeight: imageData.height,
          imageDataWidth: imageData.width,
          textureDimensions: textureDimensions,
          rpc: request.rpc,
        },
      },
      isLast ? [imageData.data.buffer] : _emptyTransferables
    );
  }

  function _requestTexture(textureUrl: string): Promise<ImageBitmap | ImageData> {
    // Do not flip the texture as the entire texture atlas is going to be
    // flipped later.
    return requestTexture(_rpcLookupTable, texturesMessagePort, textureUrl, false);
  }

  return Object.freeze({
    registerMessagePort: registerMessagePort,
    start: start,
    stop: stop,
    update: update,
  });
}
