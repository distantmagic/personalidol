import { getRouterCallback } from "./getRouterCallback";

import type { MessageEventData } from "./MessageEventData.type";
import type { MessageEventMultiRouter } from "./MessageEventMultiRouter.type";

export function routeMultiMessage(messagePort: MessagePort, data: MessageEventData, router: MessageEventMultiRouter): void {
  for (let type in data) {
    if (data.hasOwnProperty(type)) {
      getRouterCallback(router, type)(messagePort, data[type]);
    }
  }
}
