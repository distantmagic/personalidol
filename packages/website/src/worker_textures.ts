import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createReusedResponsesCache } from "@personalidol/workers/src/createReusedResponsesCache";
import { createReusedResponsesUsage } from "@personalidol/workers/src/createReusedResponsesUsage";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { keyFromTextureRequest } from "@personalidol/texture-loader/src/keyFromTextureRequest";
import { reuseResponse } from "@personalidol/workers/src/reuseResponse";

import type { ReusedResponsesCache } from "@personalidol/workers/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/workers/src/ReusedResponsesUsage.type";
import type { TextureRequest } from "@personalidol/texture-loader/src/TextureRequest.type";

const createImageBitmapOptions: {
  imageOrientation: "flipY";
} = {
  imageOrientation: "flipY",
};
const emptyTransferables: [] = [];
const loadingCache: ReusedResponsesCache = createReusedResponsesCache();
const loadingUsage: ReusedResponsesUsage = createReusedResponsesUsage();

function _createImageBitmapFlipY(blob: Blob): Promise<ImageBitmap> {
  return createImageBitmap(blob, createImageBitmapOptions);
}

function _fetchImageBitmap(textureRequest: TextureRequest): Promise<ImageBitmap> {
  const blobPromise = fetch(textureRequest.textureUrl).then(_responseToBlob);

  if (textureRequest.flipY) {
    return blobPromise.then(_createImageBitmapFlipY);
  }

  return blobPromise.then(createImageBitmap);
}

function _responseToBlob(response: Response): Promise<Blob> {
  return response.blob();
}

const textureMessagesRouter = {
  async createImageBitmap(messagePort: MessagePort, textureRequest: TextureRequest): Promise<void> {
    // prettier-ignore
    const imageBitmap = await reuseResponse(
      loadingCache,
      loadingUsage,
      keyFromTextureRequest(textureRequest),
      textureRequest,
      _fetchImageBitmap
    );

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
  texturesMessagePort(port: MessagePort): void {
    attachMultiRouter(port, textureMessagesRouter);
  },
});
