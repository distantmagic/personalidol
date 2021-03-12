/// <reference lib="webworker" />

import Loglevel from "loglevel";

import { createRouter } from "@personalidol/framework/src/createRouter";

import type { MessageWorkerReady } from "@personalidol/framework/src/MessageWorkerReady.type";

declare var self: DedicatedWorkerGlobalScope;

const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

self.onmessage = createRouter({
  ammoMessagePort(port: MessagePort): void {},

  progressMessagePort(port: MessagePort): void {},

  ready(): void {
    self.postMessage(<MessageWorkerReady>{
      ready: true,
    });
  },
});
