/// <reference lib="webworker" />

import Loglevel from "loglevel";

import { attachMultiRouter } from "@personalidol/workers/src/attachMultiRouter";
import { broadcastMessage } from "@personalidol/workers/src/broadcastMessage";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { LoadingManager } from "@personalidol/loading-manager/src/LoadingManager";
import { ServiceManager } from "@personalidol/framework/src/ServiceManager";

import type { LoadingError } from "@personalidol/loading-manager/src/LoadingError.type";
import type { LoadingManagerItem } from "@personalidol/loading-manager/src/LoadingManagerItem.type";
import type { LoadingManagerProgress } from "@personalidol/loading-manager/src/LoadingManagerProgress.type";

declare var self: DedicatedWorkerGlobalScope;

const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const loadingManager = LoadingManager();
const messagePorts: Array<MessagePort> = [];
const serviceManager = ServiceManager(logger);

let _lastProgressBroadcast: number = 0;

serviceManager.services.add(loadingManager);

function _refreshNotifyProgress(): void {
  loadingManager.update();

  if (_lastProgressBroadcast >= loadingManager.state.version) {
    return;
  }

  _lastProgressBroadcast = loadingManager.state.version;

  const progress: LoadingManagerProgress = {
    comment: loadingManager.state.comment,
    expectsAtLeast: loadingManager.state.expectsAtLeast,
    progress: loadingManager.state.progress,
  };

  broadcastMessage(messagePorts, {
    progress: progress,
  });
}

const progressMessagesRouter = {
  done(messagePort: MessagePort, item: LoadingManagerItem) {
    loadingManager.done(item);
    _refreshNotifyProgress();
  },

  error(messagePort: MessagePort, error: LoadingError) {
    broadcastMessage(messagePorts, {
      error: error,
    });
  },

  expectAtLeast(messagePort: MessagePort, expectAtLeast: number) {
    logger.debug(`PROGRESS_EXPECT_AT_LEAST(${expectAtLeast})`);
    loadingManager.expectAtLeast(expectAtLeast);
  },

  loading(messagePort: MessagePort, item: LoadingManagerItem) {
    loadingManager.waitFor(item);
    _refreshNotifyProgress();
  },

  reset() {
    loadingManager.reset();
    _refreshNotifyProgress();
  },
};

self.onmessage = createRouter({
  progressMessagePort({ broadcastProgress, messagePort }: { broadcastProgress: boolean; messagePort: MessagePort }): void {
    if (broadcastProgress) {
      messagePorts.push(messagePort);
    }

    attachMultiRouter(messagePort, progressMessagesRouter);
  },

  ready(): void {
    self.postMessage({
      ready: true,
    });
  },

  start(): void {
    serviceManager.start();
  },

  stop(): void {
    serviceManager.stop();
  },
});
