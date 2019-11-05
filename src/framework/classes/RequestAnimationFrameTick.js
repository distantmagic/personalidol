// @flow

import type { RequestAnimationFrameTick as RequestAnimationFrameTickInterface } from "../interfaces/RequestAnimationFrameTick";

export default class RequestAnimationFrameTick implements RequestAnimationFrameTickInterface {
  canceled: boolean;

  constructor(canceled: boolean) {
    this.canceled = canceled;
  }

  isCanceled(): boolean {
    return this.canceled;
  }
}
