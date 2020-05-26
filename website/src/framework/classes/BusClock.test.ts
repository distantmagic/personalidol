import BusClock from "src/framework/classes/BusClock";
import CancelToken from "src/framework/classes/CancelToken";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";

test("ticks", async function () {
  let ticks = 0;
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const clock = new BusClock(2);
  const expectedTicks = 2;

  clock.interval(cancelToken, function () {
    ticks += 1;
  });

  clock.update(0);
  clock.update(0);
  clock.update(0);
  clock.update(0);

  expect(ticks).toBe(expectedTicks);
});
