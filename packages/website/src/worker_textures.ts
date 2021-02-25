/// <reference lib="webworker" />

import Loglevel from "loglevel";

import { attachMultiRouter } from "@personalidol/framework/src/attachMultiRouter";
import { createResourceLoadMessage } from "@personalidol/loading-manager/src/createResourceLoadMessage";
import { createReusedResponsesCache } from "@personalidol/framework/src/createReusedResponsesCache";
import { createReusedResponsesUsage } from "@personalidol/framework/src/createReusedResponsesUsage";
import { createRouter } from "@personalidol/framework/src/createRouter";
import { keyFromTextureRequest } from "@personalidol/texture-loader/src/keyFromTextureRequest";
import { notifyProgressManager } from "@personalidol/loading-manager/src/notifyProgressManager";
import { reuseResponse } from "@personalidol/framework/src/reuseResponse";

import type { MessageWorkerReady } from "@personalidol/framework/src/MessageWorkerReady.type";
import type { ReusedResponsesCache } from "@personalidol/framework/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/framework/src/ReusedResponsesUsage.type";
import type { TextureRequest } from "@personalidol/texture-loader/src/TextureRequest.type";

declare var self: DedicatedWorkerGlobalScope;

type CreateImageBitmapOptions = {
  imageOrientation: "none" | "flipY";
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

    const imageBitmapResponse = reuseResponse(loadingCache, loadingUsage, keyFromTextureRequest(textureRequest), textureRequest, _fetchImageBitmap);
    const imageBitmap = await notifyProgressManager(_progressMessagePort, createResourceLoadMessage("texture", textureRequest.textureUrl), imageBitmapResponse);

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

  ready(): void {
    self.postMessage(<MessageWorkerReady>{
      ready: true,
    });
  },

  texturesMessagePort(port: MessagePort): void {
    attachMultiRouter(port, textureMessagesRouter);
  },
});
