// @flow

import CancelToken from "../classes/CancelToken";
import interval from "./interval";

it("produces interval events generator", async function() {
  const cancelToken = new CancelToken();
  const ticks = [];
  const expectedTicks = 2;

  setTimeout(function() {
    cancelToken.cancel();
  }, 50);

  for await (let tick of interval(cancelToken, 20)) {
    ticks.push(Date.now());
  }

  expect(ticks).toHaveLength(expectedTicks);
}, 1000);

it("ticks infinitely", async function() {
  const cancelToken = new CancelToken();
  const expectedTicks = 10;
  let ticksCount = 0;

  for await (let tick of interval(cancelToken, 1)) {
    ticksCount += 1;

    if (ticksCount >= expectedTicks) {
      break;
    }
  }

  expect(ticksCount).toBe(expectedTicks);
}, 1000);

it("is immediately stopped with already paused cancel token", async function() {
  const cancelToken = new CancelToken();
  const ticks = [];

  cancelToken.cancel();

  for await (let tick of interval(cancelToken, 20)) {
    ticks.push(Date.now());
  }

  expect(ticks).toHaveLength(0);
}, 1000);
