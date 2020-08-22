/// <reference lib="webworker" />

import { routeMessages } from "./routeMessages";

import type { MessageEventRouter } from "./MessageEventRouter.type";

export function createRouter(router: MessageEventRouter) {
  return function (evt: ExtendableMessageEvent | MessageEvent): void {
    routeMessages(evt, evt.data, router);
  };
}
