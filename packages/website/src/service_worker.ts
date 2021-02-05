/// <reference lib="webworker" />

import Loglevel from "loglevel";

// import workers from "./workers.json";

declare var clients: Clients;
declare var self: ServiceWorkerGlobalScope;

const logger = Loglevel.getLogger("service_worker");

logger.setLevel(__LOG_LEVEL);

// Keeping __BUILD_ID somewhere is actually quite important, as it would reload
// the service worker after code changes.
logger.debug(`SERVICE_WORKER_SPAWNED(service_worker, ${__BUILD_ID})`);

// const _cacheable: ReadonlyArray<string> = [
//   `/favicon.ico`,
//   `${__ASSETS_BASE_PATH}/website/icon-cogs.png?${__CACHE_BUST}`,
//   `${__ASSETS_BASE_PATH}/fonts/font-almendra-bold.ttf?${__CACHE_BUST}`,
//   `${__ASSETS_BASE_PATH}/fonts/font-almendra-bolditalic.ttf?${__CACHE_BUST}`,
//   `${__ASSETS_BASE_PATH}/fonts/font-almendra-italic.ttf?${__CACHE_BUST}`,
//   `${__ASSETS_BASE_PATH}/fonts/font-almendra-regular.ttf?${__CACHE_BUST}`,
//   `${__ASSETS_BASE_PATH}/fonts/font-mukta-extrabold.ttf?${__CACHE_BUST}`,
//   `${__ASSETS_BASE_PATH}/fonts/font-mukta-extralight.ttf?${__CACHE_BUST}`,
//   `${__ASSETS_BASE_PATH}/fonts/font-mukta-light.ttf?${__CACHE_BUST}`,
//   `${__ASSETS_BASE_PATH}/fonts/font-mukta-medium.ttf?${__CACHE_BUST}`,
//   `${__ASSETS_BASE_PATH}/fonts/font-mukta-regular.ttf?${__CACHE_BUST}`,
//   `${__ASSETS_BASE_PATH}/fonts/font-mukta-semibold.ttf?${__CACHE_BUST}`,
//   `${__STATIC_BASE_PATH}${workers.atlas.url}?${__CACHE_BUST}`,
//   `${__STATIC_BASE_PATH}${workers.md2.url}?${__CACHE_BUST}`,
//   `${__STATIC_BASE_PATH}${workers.offscreen.url}?${__CACHE_BUST}`,
//   `${__STATIC_BASE_PATH}${workers.progress.url}?${__CACHE_BUST}`,
//   `${__STATIC_BASE_PATH}${workers.quakemaps.url}?${__CACHE_BUST}`,
//   `${__STATIC_BASE_PATH}${workers.textures.url}?${__CACHE_BUST}`,
//   `${__STATIC_BASE_PATH}/lib/createScenes.js?${__CACHE_BUST}`,
//   `${__STATIC_BASE_PATH}/lib/index.js?${__CACHE_BUST}`,
// ];

function _shouldCache(event: FetchEvent): boolean {
  switch (true) {
    case event.request.url.endsWith(__CACHE_BUST):
    case event.request.url.endsWith("/favicon.ico"):
      return true;
  }

  console.log("NO_CACHE", event.request.url);

  return false;
}

self.addEventListener("activate", function (event: ExtendableEvent) {
  event.waitUntil(_activate(event));
});

self.addEventListener("fetch", async function (event: FetchEvent) {
  event.respondWith(
    caches.open(__BUILD_ID).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        if (response) {
          return response;
        }

        return fetch(event.request).then(function (response) {
          if (_shouldCache(event)) {
            console.log("SERVICE_WORKER_CACHE_STORE", event.request.url);
            cache.put(event.request, response.clone());
          }

          return response;
        });
      });
    })
  );
});

self.addEventListener("install", async function (event: ExtendableEvent) {
  event.waitUntil(_install(event));
});

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
