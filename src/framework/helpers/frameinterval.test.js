// @flow

import CancelToken from "../classes/CancelToken";
import frameinterval from "./frameinterval";

it("ticks infinitely", async () => {
  let ticksCount = 0;
  const expectedTicks = 10;

  for await (let tick of frameinterval()) {
    ticksCount += 1;

    if (ticksCount >= expectedTicks) {
      break;
    }
  }

  expect(ticksCount).toBe(expectedTicks);
});

it("is immediately stopped with already paused cancel token", async () => {
  const cancelToken = new CancelToken();
  const ticks = [];

  cancelToken.cancel();

  for await (let tick of frameinterval(cancelToken)) {
    ticks.push(Date.now());
  }

  expect(ticks).toHaveLength(0);
});
