/// <reference lib="webworker" />

import Loglevel from "loglevel";

import { attachMultiRouter } from "@personalidol/framework/src/attachMultiRouter";
import { createRouter } from "@personalidol/framework/src/createRouter";
import { ProgressManager } from "@personalidol/framework/src/ProgressManager";

import type { MessageProgressChange } from "@personalidol/framework/src/MessageProgressChange.type";
import type { MessageProgressDone } from "@personalidol/framework/src/MessageProgressDone.type";
import type { MessageProgressError } from "@personalidol/framework/src/MessageProgressError.type";
import type { MessageProgressStart } from "@personalidol/framework/src/MessageProgressStart.type";
import type { MessageWorkerReady } from "@personalidol/framework/src/MessageWorkerReady.type";
import type { ProgressManager as IProgressManager } from "@personalidol/framework/src/ProgressManager.interface";
import type { ProgressManagerState } from "@personalidol/framework/src/ProgressManagerState.type";

declare var self: DedicatedWorkerGlobalScope;

const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const messagePorts: Array<MessagePort> = [];
const progressManager: IProgressManager = ProgressManager();

let _lastProgressBroadcastVersion: number = 0;

function _broadcastMessage(message: { progress: ProgressManagerState }): void {
  for (let i = 0; i < messagePorts.length; i += 1) {
    messagePorts[i].postMessage(message);
  }
}

function _refreshNotifyProgress(): void {
  if (_lastProgressBroadcastVersion >= progressManager.state.version) {
    return;
  }

  _lastProgressBroadcastVersion = progressManager.state.version;

  _broadcastMessage({
    progress: progressManager.state,
  });
}

const progressMessagesRouter = Object.freeze({
  done(messagePort: MessagePort, message: MessageProgressDone) {
    progressManager.done(message);
    _refreshNotifyProgress();
  },

  error(messagePort: MessagePort, message: MessageProgressError) {
    progressManager.error(message);
    _refreshNotifyProgress();
  },

  expect(messagePort: MessagePort, expect: number) {
    progressManager.expect(expect);
    _refreshNotifyProgress();
  },

  progress(messagePort: MessagePort, message: MessageProgressChange) {
    progressManager.progress(message);
    _refreshNotifyProgress();
  },

  reset() {
    progressManager.reset();
    _refreshNotifyProgress();
  },

  start(messagePort: MessagePort, message: MessageProgressStart) {
    progressManager.start(message);
    _refreshNotifyProgress();
  },
});

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

  start(): void {},

  stop(): void {},
});
