import { hashSplitToSubRoutes } from "./hashSplitToSubRoutes";

import type { HashHistoryService as IHashHistoryService } from "./HashHistoryService.interface";

export function HashHistoryService(): IHashHistoryService {
  let _initialHash: null | string = null;

  function start() {
    if ("string" === typeof _initialHash) {
      // Initial hash was already handled. Service can be started and stopped
      // multiple times for various reasons.
      return;
    }

    _initialHash = window.location.hash;

    console.log(hashSplitToSubRoutes(_initialHash));
  }

  function stop() {}

  return Object.freeze({
    name: "HashHistoryService",

    start: start,
    stop: stop,
  });
}

// console.log("ROUTE STATE", routesState, hashBuildFromRenderState(_subviews, routesState));
// window.location.hash = hashBuildFromRenderState(_subviews, routesState);
