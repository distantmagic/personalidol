/// <reference lib="webworker" />
/// <reference types="@types/ammo.js" />

import Loglevel from "loglevel";

import { AmmoLoader } from "@personalidol/ammo/src/AmmoLoader";
import { createRouter } from "@personalidol/framework/src/createRouter";
import { MainLoop } from "@personalidol/framework/src/MainLoop";
import { prefetch } from "@personalidol/framework/src/prefetch";
import { RequestAnimationFrameScheduler } from "@personalidol/framework/src/RequestAnimationFrameScheduler";
import { ServiceBuilder } from "@personalidol/framework/src/ServiceBuilder";

import { createDynamicsWorld } from "./createDynamicsWorld";

import type { MainLoop as IMainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { MessageWorkerReady } from "@personalidol/framework/src/MessageWorkerReady.type";
import type { ServiceBuilder as IServiceBuilder } from "@personalidol/framework/src/ServiceBuilder.interface";

declare var self: DedicatedWorkerGlobalScope;

type Dependencies = {
  ammo: typeof Ammo;
  physicsMessagePort: MessagePort;
  progressMessagePort: MessagePort;
};

const partialDependencies: Partial<Dependencies> = {
  ammo: undefined,
  physicsMessagePort: undefined,
  progressMessagePort: undefined,
};

const AMMO_WASM_URL: string = `${__STATIC_BASE_PATH}/lib/ammo.wasm.wasm?${__CACHE_BUST}`;
const logger = Loglevel.getLogger(self.name);
const mainLoop: IMainLoop = MainLoop(logger, RequestAnimationFrameScheduler());

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const ammoLoader = AmmoLoader(AMMO_WASM_URL);
const serviceBuilder: IServiceBuilder<Dependencies> = ServiceBuilder<Dependencies>(self.name, partialDependencies);

serviceBuilder.onready.add(onDependenciesReady);

function onDependenciesReady(dependencies: Dependencies): void {
  createDynamicsWorld(logger, mainLoop, dependencies.ammo, dependencies.physicsMessagePort, dependencies.progressMessagePort);
}

function notifyReady(): void {
  self.postMessage(<MessageWorkerReady>{
    ready: true,
  });
}

self.onmessage = createRouter({
  physicsMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("physicsMessagePort", port);
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

  start(): void {
    mainLoop.start();
  },

  stop(): void {
    mainLoop.stop();
  },
});
