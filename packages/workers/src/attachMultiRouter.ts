/// <reference lib="webworker" />

import { routeMultiMessage } from "./routeMultiMessage";

import type { CallbackOnAfterRouteBatch } from "./CallbackOnAfterRouteBatch.type";
import type { MessageEventMultiRouter } from "./MessageEventMultiRouter.type";

export function attachMultiRouter(messagePort: MessagePort, router: MessageEventMultiRouter, onAfterBatch: null | CallbackOnAfterRouteBatch = null): void {
  messagePort.onmessage = function (evt: ExtendableMessageEvent | MessageEvent) {
    routeMultiMessage(messagePort, evt, evt.data, router);

    if ("function" === typeof onAfterBatch) {
      onAfterBatch();
    }
  };
}
