import Loglevel from "loglevel";
import { MathUtils } from "three/src/math/MathUtils";

import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createReusedResponsesCache } from "@personalidol/workers/src/createReusedResponsesCache";
import { createReusedResponsesUsage } from "@personalidol/workers/src/createReusedResponsesUsage";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { keyFromTextureRequest } from "@personalidol/texture-loader/src/keyFromTextureRequest";
import { notifyLoadingManager } from "@personalidol/loading-manager/src/notifyLoadingManager";
import { reuseResponse } from "@personalidol/workers/src/reuseResponse";

import type { ReusedResponsesCache } from "@personalidol/workers/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/workers/src/ReusedResponsesUsage.type";
import type { TextureRequest } from "@personalidol/texture-loader/src/TextureRequest.type";

type CreateImageBitmapOptions = {
  imageOrientation: "flipY";
};

const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

let _progressMessagePort: null | MessagePort = null;
const createImageBitmapOptions: CreateImageBitmapOptions = {
  imageOrientation: "flipY",
};
const emptyTransferables: [] = [];
const loadingCache: ReusedResponsesCache = createReusedResponsesCache();
const loadingUsage: ReusedResponsesUsage = createReusedResponsesUsage();

function _createImageBitmapFlipY(blob: Blob): Promise<ImageBitmap> {
  return createImageBitmap(blob, createImageBitmapOptions);
}

function _fetchImageBitmap(textureRequest: TextureRequest): Promise<ImageBitmap> {
  return fetch(textureRequest.textureUrl).then(_responseToBlob).then(_createImageBitmapFlipY);
}

function _responseToBlob(response: Response): Promise<Blob> {
  return response.blob();
}

const textureMessagesRouter = {
  async createImageBitmap(messagePort: MessagePort, textureRequest: TextureRequest): Promise<void> {
    if (null === _progressMessagePort) {
      throw new Error(`Progress message port must be set in WORKER(${self.name}) before loading texture.`);
    }

    const loadItemImageBitmap = {
      comment: `texture ${textureRequest.textureUrl}`,
      id: MathUtils.generateUUID(),
      weight: 1,
    };
    const imageBitmapResponse = reuseResponse(loadingCache, loadingUsage, keyFromTextureRequest(textureRequest), textureRequest, _fetchImageBitmap);
    const imageBitmap = await notifyLoadingManager(_progressMessagePort, loadItemImageBitmap, imageBitmapResponse);

    // prettier-ignore
    messagePort.postMessage(
      {
        imageBitmap: {
          imageBitmap: imageBitmap.data,
          rpc: textureRequest.rpc,
        },
      },
      // Transfer the last one to not occupy more memory than necessary.
      imageBitmap.isLast
        ? [imageBitmap.data]
        : emptyTransferables
    );
  },
};

self.onmessage = createRouter({
  progressMessagePort(port: MessagePort): void {
    if (null !== _progressMessagePort) {
      throw new Error(`Progress message port was already received by WORKER(${self.name}).`);
    }

    _progressMessagePort = port;
  },

  texturesMessagePort(port: MessagePort): void {
    attachMultiRouter(port, textureMessagesRouter);
  },
});
