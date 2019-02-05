// @flow

import type { RequestAnimationFrameTick as RequestAnimationFrameTickInterface } from "../interfaces/RequestAnimationFrameTick";

export default class RequestAnimationFrameTick
  implements RequestAnimationFrameTickInterface {
  cancelled: boolean;

  constructor(cancelled: boolean) {
    this.cancelled = cancelled;
  }

  isCancelled(): boolean {
    return this.cancelled;
  }
}
