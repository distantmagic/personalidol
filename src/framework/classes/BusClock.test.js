// @flow

import BusClock from "./BusClock";
import CancelToken from "./CancelToken";

it("ticks", async () => {
  let ticks = 0;
  const cancelToken = new CancelToken();
  const clock = new BusClock(20);
  const expectedTicks = 2;

  setTimeout(function() {
    cancelToken.cancel();
  }, 50);

  for await (let tick of clock.interval(cancelToken)) {
    ticks += 1;
  }

  expect(ticks).toBe(expectedTicks);
});
