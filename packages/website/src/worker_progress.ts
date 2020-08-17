import Loglevel from "loglevel";

import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { createRouter } from "@personalidol/workers/src/createRouter";

const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const progressMessagesRouter = {
};

self.onmessage = createRouter({
  progressMessagePort(port: MessagePort): void {
    attachMultiRouter(port, progressMessagesRouter);
  },
});
