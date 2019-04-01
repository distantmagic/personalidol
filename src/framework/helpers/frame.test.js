// @flow

import CancelToken from "../classes/CancelToken";
import frame from "./frame";

it("ticks", async () => {
  const cancelToken = new CancelToken();

  const tick = await frame(cancelToken);

  expect(tick.isCancelled()).toBeFalsy();
});

it("is immediately stopped with already paused cancel token", async () => {
  const cancelToken = new CancelToken();

  cancelToken.cancel();

  const tick = await frame(cancelToken);

  expect(tick.isCancelled()).toBeTruthy();
});
