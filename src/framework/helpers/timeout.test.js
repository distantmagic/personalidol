// @flow

import CancelToken from "../classes/CancelToken";
import timeout from "./timeout";

it("supports cancel token", async () => {
  const cancelToken = new CancelToken();

  setTimeout(function() {
    cancelToken.cancel();
  }, 25);

  // return timeout tick with the time that actually elapsed
  const tick = await timeout(10000, cancelToken);

  expect(tick.isCancelled()).toBeTruthy();
});

it("is immediately stopped with already paused cancel token", async () => {
  const cancelToken = new CancelToken();

  cancelToken.cancel();

  const tick = await timeout(10000, cancelToken);

  expect(tick.isCancelled()).toBeTruthy();
});
