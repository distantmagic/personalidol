// @flow

import CancelToken from "../../classes/CancelToken";
import timeout from "../../helpers/timeout";

it("supports cancel token", async () => {
  const cancelToken = new CancelToken();

  setTimeout(function() {
    cancelToken.cancel();
  }, 25);

  // return timeout tick with the time that actually elapsed
  await timeout(10000, cancelToken);
});
