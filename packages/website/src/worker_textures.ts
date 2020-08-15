import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createReusedResponsesCache } from "@personalidol/workers/src/createReusedResponsesCache";
import { createReusedResponsesUsage } from "@personalidol/workers/src/createReusedResponsesUsage";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { fetchImageBitmap } from "@personalidol/texture-loader/src/fetchImageBitmap";
import { reuseResponse } from "@personalidol/workers/src/reuseResponse";

import type { ReusedResponsesCache } from "@personalidol/workers/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/workers/src/ReusedResponsesUsage.type";

const createImageBitmapOptions: {
  imageOrientation: "flipY";
} = {
  imageOrientation: "flipY",
};
const emptyTransferables: [] = [];
const loadingCache: ReusedResponsesCache = createReusedResponsesCache();
const loadingUsage: ReusedResponsesUsage = createReusedResponsesUsage();

function _createImageBitmap(blob: Blob): Promise<ImageBitmap> {
  return createImageBitmap(blob, createImageBitmapOptions);
}

function _fetchImageBitmap(textureUrl: string): Promise<ImageBitmap> {
  return fetch(textureUrl).then(_responseToBlob).then(_createImageBitmap);
}

function _responseToBlob(response: Response): Promise<Blob> {
  return response.blob();
}

const textureMessagesRouter = {
  async createImageBitmap(messagePort: MessagePort, { textureUrl, rpc }: { textureUrl: string; rpc: string }): Promise<void> {
    const imageBitmap = await reuseResponse(loadingCache, loadingUsage, textureUrl, _fetchImageBitmap);

    // prettier-ignore
    messagePort.postMessage(
      {
        imageBitmap: {
          imageBitmap: imageBitmap.data,
          rpc: rpc,
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
