import type { MessageEventRouter } from "./MessageEventRouter.type";
import type { MessageEventMultiRouter } from "./MessageEventMultiRouter.type";

export function getRouterCallback<Router extends MessageEventRouter | MessageEventMultiRouter, Type extends keyof Router>(router: Router, type: Type): Router[Type] {
  if ("function" !== typeof router[type]) {
    throw new Error(`MessageEvent type has no assigned callback: "${type}"`);
  }

  return router[type];
}
