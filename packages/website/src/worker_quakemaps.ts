import Loglevel from "loglevel";

import { MathUtils } from "three/src/math/MathUtils";
import { Vector3 } from "three/src/math/Vector3";

import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { buildEntities } from "@personalidol/quakemaps/src/buildEntities";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { createRPCLookupTable } from "@personalidol/workers/src/createRPCLookupTable";
import { handleRPCResponse } from "@personalidol/workers/src/handleRPCResponse";
import { notifyLoadingManager } from "@personalidol/loading-manager/src/notifyLoadingManager";
import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";
import { unmarshalMap } from "@personalidol/quakemaps/src/unmarshalMap";

import type { Vector3 as IVector3 } from "three";

import type { AtlasTextureDimension } from "@personalidol/texture-loader/src/AtlasTextureDimension.type";
import type { EntityAny } from "@personalidol/quakemaps/src/EntityAny.type";
import type { EntitySketch } from "@personalidol/quakemaps/src/EntitySketch.type";
import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";
import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();
let _atlasMessagePort: null | MessagePort = null;
let _progressMessagePort: null | MessagePort = null;

const _atlasMessageRouter = createRouter({
  textureAtlas: handleRPCResponse(_rpcLookupTable),
});

async function _fetchUnmarshalMapContent(
  messagePort: MessagePort,
  atlasMessagePort: MessagePort,
  filename: string,
  rpc: string,
  discardOccluding: null | Vector3Simple = null
): Promise<void> {
  const content: string = await fetch(filename).then(_responseToText);

  return _onMapContentLoaded(messagePort, atlasMessagePort, filename, rpc, content, discardOccluding);
}

async function _onMapContentLoaded(
  messagePort: MessagePort,
  atlasMessagePort: MessagePort,
  filename: string,
  rpc: string,
  content: string,
  discardOccluding: null | Vector3Simple = null
): Promise<void> {
  const discardOccludingVector3: null | IVector3 = discardOccluding ? new Vector3(discardOccluding.x, discardOccluding.y, discardOccluding.z) : null;
  const entities: Array<EntityAny> = [];
  const entitySketches: Array<EntitySketch> = [];
  const textureUrls: Array<string> = [];

  function _resolveTextureUrl(textureName: string): string {
    const textureUrl = `/${textureName}.png`;

    if (!textureUrls.includes(textureUrl)) {
      textureUrls.push(textureUrl);
    }

    return textureUrl;
  }

  for (let entitySketch of unmarshalMap(filename, content, _resolveTextureUrl)) {
    entitySketches.push(entitySketch);
  }

  const { createTextureAtlas: textureAtlas } = await sendRPCMessage(_rpcLookupTable, atlasMessagePort, {
    createTextureAtlas: {
      textureUrls: textureUrls,
      rpc: MathUtils.generateUUID(),
    },
  });

  function _resolveTextureDimensions(textureName: string): AtlasTextureDimension {
    if (!textureAtlas.textureDimensions.hasOwnProperty(textureName)) {
      throw new Error(`WORKER(${self.name}) received unexpected texture dimensions resolve request. Texture is not included in the texture atlas: "${textureName}"`);
    }

    return textureAtlas.textureDimensions[textureName];
  }

  const transferables = [textureAtlas.imageDataBuffer];

  for (let entity of buildEntities(filename, entitySketches, _resolveTextureDimensions, discardOccludingVector3)) {
    entities.push(entity);
    transferables.push(...entity.transferables);
  }

  messagePort.postMessage(
    {
      map: {
        entities: entities,
        rpc: rpc,
        textureAtlas: textureAtlas,
      },
    },
    transferables
  );
}

function _responseToText(response: Response): Promise<string> {
  return response.text();
}

const quakeMapsMessagesRouter = {
  unmarshal(messagePort: MessagePort, { discardOccluding, filename, rpc }: { discardOccluding: null | Vector3Simple; filename: string; rpc: string }): void {
    if (null === _atlasMessagePort) {
      throw new Error(`Atlas message port must be set in WORKER(${self.name}) before loading map.`);
    }

    if (null === _progressMessagePort) {
      throw new Error(`Progress message port must be set in WORKER(${self.name}) before loading map.`);
    }

    const loadItemMap = {
      comment: `map ${filename}`,
      id: MathUtils.generateUUID(),
      weight: 2,
    };

    notifyLoadingManager(_progressMessagePort, loadItemMap, _fetchUnmarshalMapContent(messagePort, _atlasMessagePort, filename, rpc, discardOccluding));
  },
};

self.onmessage = createRouter({
  quakeMapsMessagePort(port: MessagePort): void {
    attachMultiRouter(port, quakeMapsMessagesRouter);
  },

  atlasMessagePort(port: MessagePort): void {
    if (null !== _atlasMessagePort) {
      throw new Error(`Atlas message port was already received by WORKER(${self.name}).`);
    }

    _atlasMessagePort = port;
    _atlasMessagePort.onmessage = _atlasMessageRouter;
  },

  progressMessagePort(port: MessagePort): void {
    if (null !== _progressMessagePort) {
      throw new Error(`Progress message port was already received by WORKER(${self.name}).`);
    }

    _progressMessagePort = port;
  },
});
