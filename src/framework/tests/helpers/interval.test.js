// @flow

import CancelToken from "../../classes/CancelToken";
import interval from "../../helpers/interval";

it("produces interval events generator", async () => {
  const cancelToken = new CancelToken();
  const ticks = [];
  const expectedTicks = 2;

  let cancelledAt;

  setTimeout(function() {
    cancelToken.cancel();
  }, 40);

  for await (let tick of interval(20, cancelToken)) {
    ticks.push(Date.now());
  }

  expect(ticks).toHaveLength(expectedTicks);
});

it("ticks infinitely", async () => {
  let ticksCount = 0;
  const expectedTicks = 2;

  for await (let tick of interval(1)) {
    ticksCount += 1;

    if (ticksCount >= expectedTicks) {
      break;
    }
  }

  expect(ticksCount).toBe(expectedTicks);
});
