import { render } from "preact";

import { createRouter } from "@personalidol/workers/src/createRouter";

import type { ClearRoutesList } from "./ClearRoutesList.type";
import type { DOMRendererCallback } from "./DOMRendererCallback.type";
import type { DOMRendererService as IDOMRendererService } from "./DOMRendererService.interface";
import type { RoutesState } from "./RoutesState.type";

function _clearHTMLElement(htmlElement: HTMLElement): void {
  while (htmlElement.lastChild) {
    htmlElement.removeChild(htmlElement.lastChild);
  }
}

export function DOMRendererService(messagePort: MessagePort, uiRootElement: HTMLElement, renderDOMUIRouter: DOMRendererCallback): IDOMRendererService {
  const _routesState: RoutesState = {};
  let _isRootElementCleared = false;

  const _messageHandlers = {
    clear: _clear,
    render: _renderWithCleanup,
  };

  const _messagesRouter = createRouter(_messageHandlers);

  function start() {
    messagePort.onmessage = _messagesRouter;
  }

  function stop() {
    messagePort.onmessage = null;
  }

  function _clear(clearRoutesList: ClearRoutesList) {
    for (let route of clearRoutesList) {
      delete _routesState[route];
    }
  }

  function _renderWithCleanup(diffRoutesState: RoutesState) {
    if (!_isRootElementCleared) {
      // clean up the ui node before rendering anything else
      _clearHTMLElement(uiRootElement);
      _isRootElementCleared = true;

      _messageHandlers.render = _renderWithoutCleanup;
    }

    _renderWithoutCleanup(diffRoutesState);
  }

  function _renderWithoutCleanup(diffRoutesState: RoutesState) {
    _updateRoutesState(diffRoutesState);
    render(renderDOMUIRouter(_routesState), uiRootElement);
  }

  function _updateRoutesState(diffRoutesState: RoutesState) {
    for (let route in diffRoutesState) {
      if (diffRoutesState.hasOwnProperty(route)) {
        _routesState[route] = diffRoutesState[route];
      }
    }
  }

  return Object.freeze({
    name: "DOMRendererService",

    start: start,
    stop: stop,
  });
}
