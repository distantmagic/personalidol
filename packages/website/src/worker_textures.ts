import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { fetchImageBitmap } from "@personalidol/texture-loader/src/fetchImageBitmap";
import { createRouter } from "@personalidol/workers/src/createRouter";

const textureMessagesRouter = {
  async loadImageBitmap(messagePort: MessagePort, { textureUrl, rpc }: { textureUrl: string; rpc: string }): Promise<void> {
    const imageBitmap = await fetchImageBitmap(textureUrl);

    messagePort.postMessage(
      {
        imageBitmap: {
          imageBitmap: imageBitmap,
          rpc: rpc,
        },
      },
      [imageBitmap]
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
