/// <reference lib="webworker" />
/// <reference types="@types/ammo.js" />

import Loglevel from "loglevel";

import { AmmoLoader } from "@personalidol/ammo/src/AmmoLoader";
import { createRouter } from "@personalidol/framework/src/createRouter";
import { prefetch } from "@personalidol/framework/src/prefetch";
import { ServiceBuilder } from "@personalidol/framework/src/ServiceBuilder";

import type { MessageWorkerReady } from "@personalidol/framework/src/MessageWorkerReady.type";
import type { ServiceBuilder as IServiceBuilder } from "@personalidol/framework/src/ServiceBuilder.interface";

declare var self: DedicatedWorkerGlobalScope;

type Dependencies = {
  ammo: Ammo.Type;
  ammoMessagePort: MessagePort;
  progressMessagePort: MessagePort;
};

const partialDependencies: Partial<Dependencies> = {
  ammo: undefined,
  ammoMessagePort: undefined,
  progressMessagePort: undefined,
};

const AMMO_WASM_URL: string = `${__STATIC_BASE_PATH}/lib/ammo.wasm.wasm?${__CACHE_BUST}`;
const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const ammoLoader = AmmoLoader(AMMO_WASM_URL);
const serviceBuilder: IServiceBuilder<Dependencies> = ServiceBuilder<Dependencies>(self.name, partialDependencies);

serviceBuilder.onready.add(onDependenciesReady);

function onDependenciesReady(dependencies: Dependencies): void {
  console.log("AMMO DEPENDENCIES READY", dependencies);
}

function notifyReady(): void {
  self.postMessage(<MessageWorkerReady>{
    ready: true,
  });
}

self.onmessage = createRouter({
  ammoMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("ammoMessagePort", port);
  },

  async progressMessagePort(port: MessagePort): Promise<void> {
    serviceBuilder.setDependency("progressMessagePort", port);
    await prefetch(port, "worker", AMMO_WASM_URL);
    serviceBuilder.setDependency("ammo", await ammoLoader.loadWASM());
  },

  ready(): void {
    if (serviceBuilder.isReady()) {
      notifyReady();
    } else {
      serviceBuilder.onready.add(notifyReady);
    }
  },
});
