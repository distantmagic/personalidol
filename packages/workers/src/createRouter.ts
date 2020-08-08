import { routeMessages } from "./routeMessages";

import type { MessageEventRouter } from "./MessageEventRouter.type";

export function createRouter(router: MessageEventRouter) {
  return function (evt: MessageEvent): void {
    routeMessages(evt.data, router);
  };
}
