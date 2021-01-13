import type { ProgressManagerItem } from "./ProgressManagerItem.type";

export function notifyProgressManager<T>(progressMessagePort: MessagePort, item: ProgressManagerItem, waitFor: Promise<T>): Promise<T> {
  progressMessagePort.postMessage({
    loading: item,
  });

  return waitFor
    .then(function (ret) {
      progressMessagePort.postMessage({
        done: item,
      });

      return ret;
    })
    .catch(function (err) {
      progressMessagePort.postMessage({
        error: {
          item: item,
          error: {
            message: err.message,
            stack: err.stack,
          },
        },
      });

      throw err;
    });
}
