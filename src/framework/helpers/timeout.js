// @flow

import TimeoutTick from "../classes/TimeoutTick";

import type { CancelToken } from "../interfaces/CancelToken";
import type { TimeoutTick as TimeoutTickInterface } from "../interfaces/TimeoutTick";

export default function timeout(
  cancelToken: CancelToken,
  delay: number
): Promise<TimeoutTickInterface> {
  return new Promise(function(resolve) {
    if (cancelToken && cancelToken.isCancelled()) {
      return void resolve(new TimeoutTick(true));
    }

    const timeoutId = setTimeout(function() {
      resolve(new TimeoutTick(false));
    }, delay);

    // console.log("on cancelled", delay);
    cancelToken.onCancelled(function() {
      clearTimeout(timeoutId);
      resolve(new TimeoutTick(true));
    });
  });
}
