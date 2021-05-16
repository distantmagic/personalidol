import { getRouterCallback } from "./getRouterCallback";

import type { MessageEventData } from "./MessageEventData.type";
import type { MessageEventRouter } from "./MessageEventRouter.type";

export function routeMessages(
  evt: ExtendableMessageEvent | MessageEvent,
  data: MessageEventData,
  routes: MessageEventRouter
): void {
  for (let type in data) {
    if (data.hasOwnProperty(type)) {
      getRouterCallback(routes, type)(data[type], evt);
    }
  }
}
