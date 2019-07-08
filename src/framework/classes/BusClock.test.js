// @flow

import BusClock from "./BusClock";
import CancelToken from "./CancelToken";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

it("ticks", async function() {
  let ticks = 0;
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const clock = new BusClock(20);
  const expectedTicks = 2;

  setTimeout(function() {
    cancelToken.cancel(loggerBreadcrumbs.add("setTimeout"));
  }, 50);

  for await (let tick of clock.interval(cancelToken)) {
    ticks += 1;
  }

  expect(ticks).toBe(expectedTicks);
});
