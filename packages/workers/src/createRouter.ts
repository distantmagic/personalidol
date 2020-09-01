/// <reference lib="webworker" />

import { routeMessages } from "./routeMessages";

import type { CallbackOnAfterRouteBatch } from "./CallbackOnAfterRouteBatch.type";
import type { MessageEventHandler } from "./MessageEventHandler.type";
import type { MessageEventRouter } from "./MessageEventRouter.type";

export function createRouter(router: MessageEventRouter, onAfterBatch: null | CallbackOnAfterRouteBatch = null): MessageEventHandler {
  return function (evt: ExtendableMessageEvent | MessageEvent): void {
    routeMessages(evt, evt.data, router);

    if ("function" === typeof onAfterBatch) {
      onAfterBatch();
    }
  };
}
