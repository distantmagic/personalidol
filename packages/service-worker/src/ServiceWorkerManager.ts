import type { Logger } from "loglevel";

import type { ServiceWorkerManager as IServiceWorkerManager } from "./ServiceWorkerManager.interface";

export function ServiceWorkerManager(logger: Logger, serviceWorkerFilename: string): IServiceWorkerManager {
  async function install() {
    await navigator.serviceWorker.register(serviceWorkerFilename);
    await navigator.serviceWorker.ready;
  }

  return {
    install: install,
  };
}
