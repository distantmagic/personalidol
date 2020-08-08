import { Vector3 } from "three/src/math/Vector3";

import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { unmarshal } from "@personalidol/quakemaps/src/unmarshal";

import type { Vector3 as IVector3 } from "three";

import type { EntityAny } from "@personalidol/quakemaps/src/EntityAny.type";
import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

function onMapContentLoaded(messagePort: MessagePort, filename: string, rpc: string, content: string, discardOccluding: Vector3Simple): void {
  const discardOccludingVector3: null | IVector3 = discardOccluding ? new Vector3(discardOccluding.x, discardOccluding.y, discardOccluding.z) : null;
  const entities: Array<EntityAny> = [];
  const transferables = [];

  for (let entity of unmarshal(filename, content, discardOccludingVector3)) {
    entities.push(entity);
    transferables.push(...entity.transferables);
  }

  messagePort.postMessage(
    {
      map: {
        entities: entities,
        rpc: rpc,
      },
    },
    transferables
  );
}

function _responseToText(response: Response): Promise<string> {
  return response.text();
}

const quakeMapsMessagesRouter = {
  unmarshal(messagePort: MessagePort, { discardOccluding, filename, rpc }: { discardOccluding: Vector3Simple; filename: string; rpc: string }): void {
    fetch(filename)
      .then(_responseToText)
      .then(function (content: string) {
        onMapContentLoaded(messagePort, filename, rpc, content, discardOccluding);
      });
  },
};

self.onmessage = createRouter({
  quakeMapsMessagePort(port: MessagePort): void {
    attachMultiRouter(port, quakeMapsMessagesRouter);
  },
});
