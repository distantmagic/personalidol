/// <reference lib="webworker" />

import Loglevel from "loglevel";

import { attachMultiRouter } from "@personalidol/framework/src/attachMultiRouter";
import { broadcastMessage } from "@personalidol/framework/src/broadcastMessage";
import { createRouter } from "@personalidol/framework/src/createRouter";
import { ProgressManager } from "@personalidol/loading-manager/src/ProgressManager";
import { ServiceManager } from "@personalidol/framework/src/ServiceManager";

import type { MessageWorkerReady } from "@personalidol/framework/src/MessageWorkerReady.type";
import type { ProgressError } from "@personalidol/loading-manager/src/ProgressError.type";
import type { ProgressManagerItem } from "@personalidol/loading-manager/src/ProgressManagerItem.type";
import type { ProgressManagerProgress } from "@personalidol/loading-manager/src/ProgressManagerProgress.type";

declare var self: DedicatedWorkerGlobalScope;

const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const messagePorts: Array<MessagePort> = [];
const progressManager = ProgressManager();
const serviceManager = ServiceManager(logger);

let _lastProgressBroadcast: number = 0;

serviceManager.services.add(progressManager);

function _refreshNotifyProgress(): void {
  progressManager.update();

  if (_lastProgressBroadcast >= progressManager.state.version) {
    return;
  }

  _lastProgressBroadcast = progressManager.state.version;

  const progress: ProgressManagerProgress = {
    comment: progressManager.state.comment,
    expectsAtLeast: progressManager.state.expectsAtLeast,
    progress: progressManager.state.progress,
  };

  broadcastMessage(messagePorts, {
    progress: progress,
  });
}

const progressMessagesRouter = {
  done(messagePort: MessagePort, item: ProgressManagerItem) {
    progressManager.done(item);
    _refreshNotifyProgress();
  },

  error(messagePort: MessagePort, error: ProgressError) {
    broadcastMessage(messagePorts, {
      error: error,
    });
  },

  expectAtLeast(messagePort: MessagePort, expectAtLeast: number) {
    logger.debug(`PROGRESS_EXPECT_AT_LEAST(${expectAtLeast})`);
    progressManager.expectAtLeast(expectAtLeast);
  },

  loading(messagePort: MessagePort, item: ProgressManagerItem) {
    progressManager.waitFor(item);
    _refreshNotifyProgress();
  },

  reset() {
    progressManager.reset();
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
    self.postMessage(<MessageWorkerReady>{
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
