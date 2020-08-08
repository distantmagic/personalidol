import { render } from "preact";

import { createRouter } from "@personalidol/workers/src/createRouter";

import type { DOMRendererCallback } from "./DOMRendererCallback.type";
import type { DOMRendererService as IDOMRendererService } from "./DOMRendererService.interface";

export function DOMRendererService(messagePort: MessagePort, uiRootElement: HTMLElement, renderDOMUIRouter: DOMRendererCallback): IDOMRendererService {
  const _messagesRouter = createRouter({
    render(data) {
      render(renderDOMUIRouter(data), uiRootElement);
    },
  });

  function start() {
    messagePort.onmessage = _messagesRouter;
  }

  function stop() {
    messagePort.onmessage = null;
  }

  function update() {}

  return Object.freeze({
    start: start,
    stop: stop,
    update: update,
  });
}
