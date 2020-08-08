import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { LoadingManager } from "three/src/loaders/LoadingManager";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { MD2Loader } from "@personalidol/framework/src/MD2Loader";

type ModelParts = {
  body: string;
};

type ModelPartsCache = Map<string, Promise<ModelParts>>;

const loadingManager = new LoadingManager();
const md2Loader = new MD2Loader(loadingManager);
const modelPartsCache: ModelPartsCache = new Map();

function fetchModelParts(modelName: string, cache: ModelPartsCache): Promise<ModelParts> {
  const cached = cache.get(modelName);

  if (cached) {
    return cached;
  }

  const ret = fetch(`/models/model-md2-${modelName}/parts.json`).then(function (response) {
    return response.json() as Promise<ModelParts>;
  });

  cache.set(modelName, ret);

  return ret;
}

const md2MessagesRouter = {
  async load(messagePort: MessagePort, { model_name, rpc }: { model_name: string; rpc: string }) {
    const parts = await fetchModelParts(model_name, modelPartsCache);
    const geometry = await md2Loader.loadAsync(`/models/model-md2-${model_name}/${parts.body}`);

    messagePort.postMessage(
      {
        geometry: {
          geometry: {
            normals: geometry.normals,
            parts: parts,
            uvs: geometry.uvs,
            vertices: geometry.vertices,
          },
          rpc: rpc,
        },
      },
      geometry.transferables
    );
  },
};

self.onmessage = createRouter({
  md2MessagePort(port: MessagePort): void {
    attachMultiRouter(port, md2MessagesRouter);
  },
});
