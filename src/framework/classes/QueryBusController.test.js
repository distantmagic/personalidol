// @flow

import BusClock from "./BusClock";
import CancelToken from "./CancelToken";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QueryBus from "./QueryBus";
import QueryBusController from "./QueryBusController";

it("supports cancel token", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const clock = new BusClock(10000);
  const queryBus = new QueryBus(loggerBreadcrumbs);
  const controller = new QueryBusController(clock, queryBus);

  setTimeout(function() {
    cancelToken.cancel();
  });

  await controller.interval(cancelToken);
});
