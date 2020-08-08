import type { LoadingManagerState } from "./LoadingManagerState.type";

export function resetLoadingManagerState(loadingManagerState: LoadingManagerState): void {
  loadingManagerState.comment = "";
  loadingManagerState.expectsAtLeast = 0;
  loadingManagerState.itemsLoaded.clear();
  loadingManagerState.itemsToLoad.clear();
  loadingManagerState.progress = 0;
}
