/// <reference lib="webworker" />

import Loglevel from "loglevel";
import { LoadingManager } from "three/src/loaders/LoadingManager";

import { attachMultiRouter } from "@personalidol/framework/src/attachMultiRouter";
import { createReusedResponsesCache } from "@personalidol/framework/src/createReusedResponsesCache";
import { createReusedResponsesUsage } from "@personalidol/framework/src/createReusedResponsesUsage";
import { createRouter } from "@personalidol/framework/src/createRouter";
import { fetchProgress } from "@personalidol/loading-manager/src/fetchProgress";
import { MD2Loader } from "@personalidol/three-modules/src/loaders/MD2Loader";
import { Progress } from "@personalidol/loading-manager/src/Progress";
import { reuseResponse } from "@personalidol/framework/src/reuseResponse";

import type { MD2GeometryParts } from "@personalidol/three-modules/src/loaders/MD2GeometryParts.type";
import type { MD2LoaderParsedGeometry } from "@personalidol/three-modules/src/loaders/MD2LoaderParsedGeometry.type";
import type { MD2LoaderParsedGeometryWithParts } from "@personalidol/three-modules/src/loaders/MD2LoaderParsedGeometryWithParts.type";
import type { MessageWorkerReady } from "@personalidol/framework/src/MessageWorkerReady.type";
import type { ReusedResponse } from "@personalidol/framework/src/ReusedResponse.type";
import type { ReusedResponsesCache } from "@personalidol/framework/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/framework/src/ReusedResponsesUsage.type";
import type { RPCMessage } from "@personalidol/framework/src/RPCMessage.type";

declare var self: DedicatedWorkerGlobalScope;

type ModelLoadRequest = RPCMessage & {
  model_name: string;
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

function _md2LoadWithProgress(url: string): Promise<MD2LoaderParsedGeometry> {
  if (null === _progressMessagePort) {
    throw new Error(`Progress message port must be set in WORKER(${self.name}) before loading MD2 model.`);
  }

  const progress = Progress(_progressMessagePort, "model");

  progress.start();

  return progress.wait(
    _md2LoadAsync(url, function (evt: ProgressEvent) {
      progress.progress(evt.loaded, evt.total);
    })
  );
}

async function _loadGeometry(messagePort: MessagePort, rpc: string, modelName: string): Promise<void> {
  const partsUrl = `${__ASSETS_BASE_PATH}/models/model-md2-${modelName}/parts.json?${__CACHE_BUST}`;
  const parts: ReusedResponse<MD2GeometryParts> = await reuseResponse(loadingCache, loadingUsage, partsUrl, partsUrl, _fetchModelParts);

  const modelUrl = `${__ASSETS_BASE_PATH}/models/model-md2-${modelName}/${parts.data.body}?${__CACHE_BUST}`;
  const geometry: ReusedResponse<MD2LoaderParsedGeometry> = await reuseResponse(loadingCache, loadingUsage, modelUrl, modelUrl, _md2LoadWithProgress);

  // prettier-ignore
  messagePort.postMessage(
    {
      geometry: <MD2LoaderParsedGeometryWithParts & RPCMessage>{
        boundingBoxes: geometry.data.boundingBoxes,
        frames: geometry.data.frames,
        morphNormals: geometry.data.morphNormals,
        morphPositions: geometry.data.morphPositions,
        normals: geometry.data.normals,
        parts: parts.data,
        transferables: emptyTransferables,
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

function _responseToModelParts(response: Response): Promise<MD2GeometryParts> {
  return response.json() as Promise<MD2GeometryParts>;
}

function _fetchModelParts(partsUrl: string): Promise<MD2GeometryParts> {
  if (null === _progressMessagePort) {
    throw new Error(`Progress message port must be set in WORKER(${self.name}) before loading MD2 model.`);
  }

  const progress = Progress(_progressMessagePort, "model_parts");

  progress.start();

  return progress.wait(fetch(partsUrl).then(fetchProgress(progress.progress)).then(_responseToModelParts));
}

const md2MessagesRouter = {
  async load(messagePort: MessagePort, { model_name, rpc }: ModelLoadRequest) {
    await _loadGeometry(messagePort, rpc, model_name);
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

  ready(): void {
    self.postMessage(<MessageWorkerReady>{
      ready: true,
    });
  },
});
