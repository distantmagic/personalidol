import Loglevel from "loglevel";
import { MathUtils } from "three/src/math/MathUtils";

import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createReusedResponsesCache } from "@personalidol/workers/src/createReusedResponsesCache";
import { createReusedResponsesUsage } from "@personalidol/workers/src/createReusedResponsesUsage";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { LoadingManager } from "three/src/loaders/LoadingManager";
import { MD2Loader } from "@personalidol/framework/src/MD2Loader";
import { notifyLoadingManager } from "@personalidol/loading-manager/src/notifyLoadingManager";
import { reuseResponse } from "@personalidol/workers/src/reuseResponse";

import type { ReusedResponsesCache } from "@personalidol/workers/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/workers/src/ReusedResponsesUsage.type";

type ModelParts = {
  body: string;
};

const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const emptyTransferables: [] = [];
const loadingCache: ReusedResponsesCache = createReusedResponsesCache();
const loadingUsage: ReusedResponsesUsage = createReusedResponsesUsage();

const _md2Loader = new MD2Loader(new LoadingManager());
const _md2LoadAsync = _md2Loader.loadAsync.bind(_md2Loader);
let _progressMessagePort: null | MessagePort = null;

async function _loadGeometry(messagePort: MessagePort, rpc: string, modelName: string): Promise<void> {
  const partsUrl = `/models/model-md2-${modelName}/parts.json`;
  const parts = await reuseResponse(loadingCache, loadingUsage, partsUrl, partsUrl, _fetchModelParts);

  const modelUrl = `/models/model-md2-${modelName}/${parts.data.body}`;
  const geometry = await reuseResponse(loadingCache, loadingUsage, modelUrl, modelUrl, _md2LoadAsync);

  // prettier-ignore
  messagePort.postMessage(
    {
      geometry: {
        normals: geometry.data.normals,
        parts: parts.data,
        rpc: rpc,
        uvs: geometry.data.uvs,
        vertices: geometry.data.vertices,
      },
    },
    // Transfer everything to not use unnecessary memory.
    geometry.isLast
      ? [
          geometry.data.normals.buffer,
          geometry.data.uvs.buffer,
          geometry.data.vertices.buffer
        ]
      : emptyTransferables
  );
}

function _responseToModelParts(response: Response): Promise<ModelParts> {
  return response.json() as Promise<ModelParts>;
}

function _fetchModelParts(partsUrl: string): Promise<ModelParts> {
  return fetch(partsUrl).then(_responseToModelParts);
}

const md2MessagesRouter = {
  async load(messagePort: MessagePort, { model_name, rpc }: { model_name: string; rpc: string }) {
    if (null === _progressMessagePort) {
      throw new Error(`Progress message port must be set in WORKER(${self.name}) before loading MD2 model.`);
    }

    const loadItemGeometry = {
      comment: `model ${model_name}`,
      id: MathUtils.generateUUID(),
      weight: 1,
    };

    notifyLoadingManager(_progressMessagePort, loadItemGeometry, _loadGeometry(messagePort, rpc, model_name));
  },
};

self.onmessage = createRouter({
  md2MessagePort(port: MessagePort): void {
    attachMultiRouter(port, md2MessagesRouter);
  },

  progressMessagePort(port: MessagePort): void {
    if (null !== _progressMessagePort) {
      throw new Error(`Progress message port was already received by WORKER(${self.name}).`);
    }

    _progressMessagePort = port;
  },
});
