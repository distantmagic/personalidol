import type { LoadingManagerItem } from "./LoadingManagerItem.type";
import type { LoadingManagerState } from "./LoadingManagerState.type";

export async function notifyLoadingManager<T>(loadingManagerState: LoadingManagerState, item: LoadingManagerItem, waitFor: Promise<T>): Promise<T> {
  loadingManagerState.itemsToLoad.add(item);

  const ret: T = await waitFor;

  loadingManagerState.itemsLoaded.add(item);

  return ret;
}
