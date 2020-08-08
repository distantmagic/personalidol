import { routeMultiMessage } from "./routeMultiMessage";

import type { MessageEventMultiRouter } from "./MessageEventMultiRouter.type";

export function attachMultiRouter(messagePort: MessagePort, router: MessageEventMultiRouter): void {
  messagePort.onmessage = function (evt: MessageEvent) {
    routeMultiMessage(messagePort, evt.data, router);
  };
}
