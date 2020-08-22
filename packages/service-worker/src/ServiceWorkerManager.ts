import { createRouter } from "@personalidol/workers/src/createRouter";

import type { Logger } from "loglevel";

import type { ServiceWorkerManager as IServiceWorkerManager } from "./ServiceWorkerManager.interface";

declare var __BUILD_ID: string;

const _eventListenerOnce = {
  once: true,
};

function _awaitServiceWorkerController(): Promise<ServiceWorker> {
  return new Promise(function (resolve, reject) {
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      function () {
        if (navigator.serviceWorker.controller) {
          resolve(navigator.serviceWorker.controller);
        } else {
          reject();
        }
      },
      _eventListenerOnce
    );
  });
}

function _getServiceWorkerController(): ServiceWorker | Promise<ServiceWorker> {
  if (navigator.serviceWorker.controller) {
    return navigator.serviceWorker.controller;
  }

  return _awaitServiceWorkerController();
}

export function ServiceWorkerManager(logger: Logger, serviceWorkerFilename: string): IServiceWorkerManager {
  async function install() {
    const serviceWorkerRegistration = await navigator.serviceWorker.register(serviceWorkerFilename);

    navigator.serviceWorker.addEventListener(
      "message",
      createRouter({
        serviceWorkerBuildId(serviceWorkerBuildId: string) {
          if (serviceWorkerBuildId === __BUILD_ID) {
            return;
          }

          serviceWorkerRegistration.update();
          logger.debug(`SERVICE_WORKER_UPDATE(${serviceWorkerBuildId}, ${__BUILD_ID})`);
        },
      })
    );

    // await serviceWorkerRegistration.update();
    await navigator.serviceWorker.ready;

    // In some scenarios, like hard refresh this promise may never be resolved.
    // This is how service workers operate.
    const controller = await _getServiceWorkerController();

    controller.postMessage({
      buildId: __BUILD_ID,
    });
  }

  return {
    install: install,
  };
}
