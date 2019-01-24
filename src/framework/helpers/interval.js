// @flow

import IntervalTick from "../classes/IntervalTick";
import timeout from "./timeout";

import type { CancelToken } from "../interfaces/CancelToken";
import type { IntervalTick as IntervalTickInterface } from "../interfaces/IntervalTick";

export default async function* interval(
  delay: number,
  cancelToken: ?CancelToken
): AsyncGenerator<IntervalTickInterface, void, void> {
  let baseline = Date.now();
  let nextTick = delay;

  while (!cancelToken || !cancelToken.isCancelled()) {
    const tick = await timeout(nextTick, cancelToken);

    if (tick.isCancelled()) {
      break;
    }

    yield new IntervalTick(tick);

    baseline += delay;
    nextTick = delay - (Date.now() - baseline);
  }
}
