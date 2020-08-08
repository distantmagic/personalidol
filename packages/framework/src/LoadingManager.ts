import type { LoadingManager as ILoadingManager } from "./LoadingManager.interface";
import type { LoadingManagerState } from "./LoadingManagerState.type";

export function LoadingManager(loadingManagerState: LoadingManagerState): ILoadingManager {
  function start() {}

  function stop() {}

  function update() {
    const totalItems = Math.max(loadingManagerState.expectsAtLeast, loadingManagerState.itemsToLoad.size);

    if (totalItems < 1) {
      return;
    }

    if (loadingManagerState.itemsLoaded.size > loadingManagerState.itemsToLoad.size) {
      throw new Error("There are more items loaded than items that are pending to load.");
    }

    loadingManagerState.comment = "";

    const comments = [];

    for (let itemToLoad of loadingManagerState.itemsToLoad) {
      if (!loadingManagerState.itemsLoaded.has(itemToLoad)) {
        loadingManagerState.comment = itemToLoad.comment;
        break;
      }
    }

    loadingManagerState.progress = Math.max(loadingManagerState.progress, loadingManagerState.itemsLoaded.size / totalItems);
  }

  return Object.freeze({
    start: start,
    stop: stop,
    update: update,
  });
}
