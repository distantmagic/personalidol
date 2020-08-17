import { render } from "preact";

import { createRouter } from "@personalidol/workers/src/createRouter";

import type { DOMRendererCallback } from "./DOMRendererCallback.type";
import type { DOMRendererService as IDOMRendererService } from "./DOMRendererService.interface";

function _clearHTMLElement(htmlElement: HTMLElement): void {
  while (htmlElement.lastChild) {
    htmlElement.removeChild(htmlElement.lastChild);
  }
}

export function DOMRendererService(messagePort: MessagePort, uiRootElement: HTMLElement, renderDOMUIRouter: DOMRendererCallback): IDOMRendererService {
  let _isCleared = false;

  const _messageHandlers = {
    render: _renderWithCleanup,
  };

  const _messagesRouter = createRouter(_messageHandlers);

  function start() {
    messagePort.onmessage = _messagesRouter;
  }

  function stop() {
    messagePort.onmessage = null;
  }

  function update() {}

  function _renderWithCleanup(data: any) {
    if (!_isCleared) {
      // clean up the ui node before rendering anything else
      _clearHTMLElement(uiRootElement);
      _isCleared = true;

      _messageHandlers.render = _renderWithoutCleanup;
    }

    _renderWithoutCleanup(data);
  }

  function _renderWithoutCleanup(data: any) {
    render(renderDOMUIRouter(data), uiRootElement);
  }

  return Object.freeze({
    name: "DOMRendererService",

    start: start,
    stop: stop,
    update: update,
  });
}
