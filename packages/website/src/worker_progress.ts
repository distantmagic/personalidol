import Loglevel from "loglevel";

import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { broadcastMessage } from "@personalidol/workers/src/broadcastMessage";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { LoadingManager } from "@personalidol/loading-manager/src/LoadingManager";
import { ServiceManager } from "@personalidol/framework/src/ServiceManager";

import type { LoadingError } from "@personalidol/loading-manager/src/LoadingError.type";
import type { LoadingManagerItem } from "@personalidol/loading-manager/src/LoadingManagerItem.type";
import type { LoadingManagerState } from "@personalidol/loading-manager/src/LoadingManagerState.type";

const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const messagePorts: Array<MessagePort> = [];
const serviceManager = ServiceManager(logger);

const loadingManagerState: LoadingManagerState = {
  comment: "",
  expectsAtLeast: 0,
  itemsLoaded: new Set(),
  itemsToLoad: new Set(),
  lastUpdate: 0,
  progress: 0,
};
const loadingManager = LoadingManager(loadingManagerState);

let _lastProgressBroadcast: number = 0;

serviceManager.services.add(loadingManager);

function _refreshNotifyProgress(): void {
  loadingManager.refreshProgress();

  if (_lastProgressBroadcast >= loadingManagerState.lastUpdate) {
    return;
  }

  _lastProgressBroadcast = loadingManagerState.lastUpdate;

  broadcastMessage(messagePorts, {
    progress: loadingManager.getProgress(),
  });
}

const progressMessagesRouter = {
  done(messagePort: MessagePort, item: LoadingManagerItem) {
    loadingManagerState.itemsLoaded.add(item);
    _refreshNotifyProgress();
  },

  error(messagePort: MessagePort, error: LoadingError) {
    broadcastMessage(messagePorts, {
      error: error,
    });
  },

  expectAtLeast(messagePort: MessagePort, expectAtLeast: number) {
    loadingManagerState.expectsAtLeast = expectAtLeast;
  },

  loading(messagePort: MessagePort, item: LoadingManagerItem) {
    loadingManagerState.itemsToLoad.add(item);
    _refreshNotifyProgress();
  },

  reset() {
    loadingManagerState.comment = "";
    loadingManagerState.expectsAtLeast = 0;
    loadingManagerState.itemsLoaded.clear();
    loadingManagerState.itemsToLoad.clear();
    loadingManagerState.progress = 0;
  },
};

self.onmessage = createRouter({
  progressMessagePort({ broadcastProgress, messagePort }: { broadcastProgress: boolean; messagePort: MessagePort }): void {
    if (broadcastProgress) {
      messagePorts.push(messagePort);
    }

    attachMultiRouter(messagePort, progressMessagesRouter);
  },

  start(): void {
    serviceManager.start();
  },

  stop(): void {
    serviceManager.stop();
  },
});
