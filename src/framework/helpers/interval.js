// @flow

import timeout from "./timeout";

import type { CancelToken } from "../interfaces/CancelToken";

export default async function* interval(
  delay: number,
  cancelToken: ?CancelToken
): AsyncGenerator<void, void, void> {
  let baseline = Date.now();
  let nextTick = delay;

  while (!cancelToken || !cancelToken.isCancelled()) {
    const tick = await timeout(nextTick, cancelToken);

    if (tick.isCancelled()) {
      break;
    }

    yield void 0;

    baseline += delay;
    nextTick = delay - (Date.now() - baseline);
  }
}
