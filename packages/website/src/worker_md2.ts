import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { LoadingManager } from "three/src/loaders/LoadingManager";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { MD2Loader } from "@personalidol/framework/src/MD2Loader";

type ModelParts = {
  body: string;
};

type ModelPartsCache = Map<string, Promise<ModelParts>>;

const loadingManager = new LoadingManager();
const loadingModels: {
  [key: string]: Promise<{
    normals: Float32Array;
    uvs: Float32Array;
    vertices: Float32Array;
  }>;
} = {};
const loadingModelsPending: {
  [key: string]: number;
} = {};
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
    const modelUrl = `/models/model-md2-${model_name}/${parts.body}`;

    if (!loadingModels.hasOwnProperty(modelUrl)) {
      loadingModels[modelUrl] = md2Loader.loadAsync(modelUrl);
      loadingModelsPending[modelUrl] = 0;
    }

    loadingModelsPending[modelUrl] += 1;

    const geometry = await loadingModels[modelUrl];

    loadingModelsPending[modelUrl] -= 1;

    const geometryCopy =
      loadingModelsPending[modelUrl] > 0
        ? {
            normals: geometry.normals.slice(),
            vertices: geometry.vertices.slice(),
            uvs: geometry.uvs.slice(),
          }
        : geometry;

    delete loadingModels[modelUrl];
    delete loadingModelsPending[modelUrl];

    messagePort.postMessage(
      {
        geometry: {
          geometry: {
            normals: geometryCopy.normals,
            parts: parts,
            uvs: geometryCopy.uvs,
            vertices: geometryCopy.vertices,
          },
          rpc: rpc,
        },
      },
      [geometryCopy.normals.buffer, geometryCopy.uvs.buffer, geometryCopy.vertices.buffer]
    );
  },
};

self.onmessage = createRouter({
  md2MessagePort(port: MessagePort): void {
    attachMultiRouter(port, md2MessagesRouter);
  },
});
