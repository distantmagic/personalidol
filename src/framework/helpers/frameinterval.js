// @flow

import RequestAnimationFrameIntervalTick from "../classes/RequestAnimationFrameIntervalTick";
import frame from "./frame";

import type { CancelToken } from "../interfaces/CancelToken";
import type { RequestAnimationFrameIntervalTick as RequestAnimationFrameIntervalTickInterface } from "../interfaces/RequestAnimationFrameIntervalTick";

export default async function* frameinterval(
  cancelToken: ?CancelToken
): AsyncGenerator<RequestAnimationFrameIntervalTickInterface, void, void> {
  while (!cancelToken || !cancelToken.isCancelled()) {
    const tick = await frame(cancelToken);

    if (tick.isCancelled()) {
      break;
    }

    yield new RequestAnimationFrameIntervalTick(tick);
  }
}
