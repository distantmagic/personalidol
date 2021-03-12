import { monitorResponseProgress } from "./monitorResponseProgress";
import { Progress } from "./Progress";

/**
 * Prefetching assumes that the service worker exists and anything that is
 * being prefetched will be stored in cache. Prefetching allows to monitor
 * download progress for items that normally do not support that.
 */
export async function prefetch(messagePort: MessagePort, resourceType: string, url: string): Promise<void> {
  const progress = Progress(messagePort, resourceType, url);

  // Just prefetch and discard the response. It should be cached in the
  // ServiceWorker.
  await progress.wait(fetch(url).then(monitorResponseProgress(progress.progress, false)));
}
