/// <reference lib="webworker" />

import Loglevel from "loglevel";

import { createRouter } from "@personalidol/workers/src/createRouter";

declare var clients: Clients;
declare var self: ServiceWorkerGlobalScope;

const logger = Loglevel.getLogger("service_worker");

logger.setLevel(__LOG_LEVEL);

// Keeping __BUILD_ID somewhere is actually quite important, as it would reload
// the service worker after code changes.
logger.debug(`SERVICE_WORKER_SPAWNED(service_worker, ${__BUILD_ID})`);

self.addEventListener("activate", function (event: ExtendableEvent) {
  event.waitUntil(_activate(event));
});

// self.addEventListener("fetch", async function (event: ExtendableEvent) {
//   console.log("SERVICE_WORKER_FETCH", event);
// });

self.addEventListener("install", async function (event: ExtendableEvent) {
  event.waitUntil(_install(event));
});

self.addEventListener(
  "message",
  createRouter({
    buildId<ExtendableMessageEvent>(buildId: string, event: ExtendableMessageEvent) {
      const source: null | Client = (event as any).source as Client;

      // Sometimes (like with CORS), we don't get the client ID.
      if (!source || !source.postMessage) {
        return;
      }

      source.postMessage(
        {
          serviceWorkerBuildId: __BUILD_ID,
        },
        []
      );
    },
  })
);

async function _clearOutdatedCache(cacheName: string): Promise<void> {
  if (__BUILD_ID !== cacheName) {
    await caches.delete(cacheName);
  }
}

async function _activate(event: ExtendableEvent): Promise<void> {
  await self.clients.claim();

  const cacheNames = await caches.keys();
  const clearCaches = cacheNames.map(_clearOutdatedCache);

  await Promise.all(clearCaches);
}

async function _install(event: ExtendableEvent): Promise<void> {
  self.skipWaiting();
}
