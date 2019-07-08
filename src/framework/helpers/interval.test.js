// @flow

import CancelToken from "../classes/CancelToken";
import interval from "./interval";
import LoggerBreadcrumbs from "../classes/LoggerBreadcrumbs";

it("produces interval events generator", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const ticks = [];
  const expectedTicks = 2;

  setTimeout(function() {
    cancelToken.cancel(loggerBreadcrumbs.add("setTimeout"));
  }, 50);

  for await (let tick of interval(cancelToken, 20)) {
    ticks.push(Date.now());
  }

  expect(ticks).toHaveLength(expectedTicks);
}, 1000);

it("ticks infinitely", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
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
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const ticks = [];

  cancelToken.cancel(loggerBreadcrumbs);

  for await (let tick of interval(cancelToken, 20)) {
    ticks.push(Date.now());
  }

  expect(ticks).toHaveLength(0);
}, 1000);
