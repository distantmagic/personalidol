import { getRouterCallback } from "./getRouterCallback";

import type { MessageEventData } from "./MessageEventData.type";
import type { MessageEventMultiRouter } from "./MessageEventMultiRouter.type";

export function routeMultiMessage(messagePort: MessagePort, evt: ExtendableMessageEvent | MessageEvent, data: MessageEventData, router: MessageEventMultiRouter): void {
  for (let type in data) {
    if (data.hasOwnProperty(type)) {
      getRouterCallback(router, type)(messagePort, data[type], evt);
    }
  }
}
