// @flow

import raf from "raf";

import RequestAnimationFrameTick from "../classes/RequestAnimationFrameTick";

import type { CancelToken } from "../interfaces/CancelToken";
import type { RequestAnimationFrameTick as RequestAnimationFrameTickInterface } from "../interfaces/RequestAnimationFrameTick";

export default function frame(
  cancelToken: ?CancelToken
): Promise<RequestAnimationFrameTickInterface> {
  return new Promise(function(resolve) {
    if (cancelToken && cancelToken.isCancelled()) {
      return void resolve(new RequestAnimationFrameTick(true));
    }

    const rafId = raf(function() {
      resolve(new RequestAnimationFrameTick(false));
    });

    if (!cancelToken) {
      return;
    }

    cancelToken.onCancelled(function() {
      raf.cancel(rafId);
      resolve(new RequestAnimationFrameTick(true));
    });
  });
}
