/// <reference lib="webworker" />

import Loglevel from "loglevel";
import { LoadingManager } from "three/src/loaders/LoadingManager";

import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createResourceLoadMessage } from "@personalidol/loading-manager/src/createResourceLoadMessage";
import { createReusedResponsesCache } from "@personalidol/workers/src/createReusedResponsesCache";
import { createReusedResponsesUsage } from "@personalidol/workers/src/createReusedResponsesUsage";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { MD2Loader } from "@personalidol/three-modules/src/loaders/MD2Loader";
import { notifyProgressManager } from "@personalidol/loading-manager/src/notifyProgressManager";
import { reuseResponse } from "@personalidol/workers/src/reuseResponse";

import type { ReusedResponsesCache } from "@personalidol/workers/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/workers/src/ReusedResponsesUsage.type";
import type { RPCMessage } from "@personalidol/workers/src/RPCMessage.type";

declare var self: DedicatedWorkerGlobalScope;

type ModelLoadRequest = RPCMessage & {
  model_name: string;
};

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
  const partsUrl = `${__ASSETS_BASE_PATH}/models/model-md2-${modelName}/parts.json`;
  const parts = await reuseResponse(loadingCache, loadingUsage, partsUrl, partsUrl, _fetchModelParts);

  const modelUrl = `${__ASSETS_BASE_PATH}/models/model-md2-${modelName}/${parts.data.body}`;
  const geometry = await reuseResponse(loadingCache, loadingUsage, modelUrl, modelUrl, _md2LoadAsync);

  // prettier-ignore
  messagePort.postMessage(
    {
      geometry: {
        frames: geometry.data.frames,
        morphNormals: geometry.data.morphNormals,
        morphPositions: geometry.data.morphPositions,
        normals: geometry.data.normals,
        parts: parts.data,
        rpc: rpc,
        uvs: geometry.data.uvs,
        vertices: geometry.data.vertices,
      },
    },
    // Transfer everything to not use unnecessary memory.
    geometry.isLast
      ? geometry.data.transferables
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
  async load(messagePort: MessagePort, { model_name, rpc }: ModelLoadRequest) {
    if (null === _progressMessagePort) {
      throw new Error(`Progress message port must be set in WORKER(${self.name}) before loading MD2 model.`);
    }

    // prettier-ignore
    notifyProgressManager(
      _progressMessagePort,
      createResourceLoadMessage("model", model_name),
      _loadGeometry(messagePort, rpc, model_name)
    );
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
