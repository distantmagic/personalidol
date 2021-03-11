import { fetchProgress } from "./fetchProgress";
import { Progress } from "./Progress";

/**
 * Prefetching assumes that the service worker exists and anything that is
 * being prefetched will be stored in cache. Prefetching allows to monitor
 * download progress for items that normally do not support that.
 */
export async function prefetch(messagePort: MessagePort, resourceType: string, url: string): Promise<void> {
  const progress = Progress(messagePort, resourceType, url);

  await progress.wait(fetch(url).then(fetchProgress(progress.progress)));
}
