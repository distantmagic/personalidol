import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { fetchImageBitmap } from "@personalidol/texture-loader/src/fetchImageBitmap";
import { reuseResponse } from "@personalidol/workers/src/reuseResponse";

import type { ReusedResponsesCache } from "@personalidol/workers/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/workers/src/ReusedResponsesUsage.type";

const emptyTransferables: [] = [];
const loadingCache: ReusedResponsesCache = {};
const loadingUsage: ReusedResponsesUsage = {};

const textureMessagesRouter = {
  async loadImageBitmap(messagePort: MessagePort, { textureUrl, rpc }: { textureUrl: string; rpc: string }): Promise<void> {
    const imageBitmap = await reuseResponse(loadingCache, loadingUsage, textureUrl, fetchImageBitmap);

    messagePort.postMessage(
      {
        imageBitmap: {
          imageBitmap: imageBitmap.data,
          rpc: rpc,
        },
      },
      // Transfer the last one to not occupy more memory than necessary.
      imageBitmap.isLast ? [imageBitmap.data] : emptyTransferables
    );
  },
};

self.onmessage = createRouter({
  atlasCanvas(atlasCanvas: OffscreenCanvas): void {
    console.log(atlasCanvas);
  },

  texturesMessagePort(port: MessagePort): void {
    attachMultiRouter(port, textureMessagesRouter);
  },
});
