// @flow

import BusClock from "./BusClock";
import CancelToken from "./CancelToken";
import QueryBus from "./QueryBus";
import QueryBusController from "./QueryBusController";

it("supports cancel token", async () => {
  const cancelToken = new CancelToken();
  const clock = new BusClock(10000);
  const queryBus = new QueryBus();
  const controller = new QueryBusController(clock, queryBus);

  setTimeout(function() {
    cancelToken.cancel();
  }, 10);

  await controller.interval(cancelToken);
});
