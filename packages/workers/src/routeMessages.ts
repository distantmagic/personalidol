import { getRouterCallback } from "./getRouterCallback";

import type { MessageEventData } from "./MessageEventData.type";
import type { MessageEventRouter } from "./MessageEventRouter.type";

export function routeMessages(data: MessageEventData, router: MessageEventRouter): void {
  for (let type in data) {
    if (data.hasOwnProperty(type)) {
      getRouterCallback(router, type)(data[type]);
    }
  }
}
