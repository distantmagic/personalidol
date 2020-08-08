import type { LoadinManagerItem } from "./LoadinManagerItem.type";
import type { LoadingManagerState } from "./LoadingManagerState.type";

export async function notifyLoadingManager<T>(loadingManagerState: LoadingManagerState, item: LoadinManagerItem, waitFor: Promise<T>): Promise<T> {
  loadingManagerState.itemsToLoad.add(item);

  const ret: T = await waitFor;

  loadingManagerState.itemsLoaded.add(item);

  return ret;
}
