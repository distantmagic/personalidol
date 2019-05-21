// @flow

import type { RequestAnimationFrameIntervalTick as RequestAnimationFrameIntervalTickInterface } from "../interfaces/RequestAnimationFrameIntervalTick";
import type { RequestAnimationFrameTick } from "../interfaces/RequestAnimationFrameTick";

export default class RequestAnimationFrameIntervalTick implements RequestAnimationFrameIntervalTickInterface {
  requestAnimationFrameTick: RequestAnimationFrameTick;

  constructor(requestAnimationFrameTick: RequestAnimationFrameTick) {
    this.requestAnimationFrameTick = requestAnimationFrameTick;
  }

  isCancelled(): boolean {
    return this.requestAnimationFrameTick.isCancelled();
  }
}
