// @flow

import BusClock from "../../classes/BusClock";
import CancelToken from "../../classes/CancelToken";
import QueryBus from "../../classes/QueryBus";
import QueryBusController from "../../classes/QueryBusController";

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
