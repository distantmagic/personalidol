import { MathUtils } from "three/src/math/MathUtils";

import { createMessageChannel } from "@personalidol/framework/src/createMessageChannel";
import { createRouter } from "@personalidol/framework/src/createRouter";
import { Director } from "@personalidol/loading-manager/src/Director";
import { mountMount } from "@personalidol/framework/src/mountMount";
import { name } from "@personalidol/framework/src/name";

import { clearHTMLElement } from "./clearHTMLElement";
import { DOMElementView } from "./DOMElementView";

import type { Logger } from "loglevel";

import type { Director as IDirector } from "@personalidol/loading-manager/src/Director.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementRenderingContext } from "./DOMElementRenderingContext.interface";
import type { DOMElementRenderingContextResolver } from "./DOMElementRenderingContextResolver.interface";
import type { DOMElementView as IDOMElementView } from "./DOMElementView.interface";
import type { DOMUIController as IDOMUIController } from "./DOMUIController.interface";
import type { MessageDOMUIDispose } from "./MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";

type RenderedElement = {
  domElementView: IDOMElementView;
  id: string;
  isAppended: boolean;
  renderingContext: DOMElementRenderingContext;
  styleSheetDirector: IDirector;
};

type RenderedElementsLookup = {
  [key: string]: RenderedElement;
};

let _isDOMElementViewDefined: boolean = false;

export function DOMUIController(
  logger: Logger,
  tickTimerState: TickTimerState,
  uiMessagePort: MessagePort,
  uiRootElement: HTMLElement,
  resolver: DOMElementRenderingContextResolver
): IDOMUIController {
  const internalDOMMessageChannel: MessageChannel = createMessageChannel();
  let _delta: number = 0;
  let _elapsedTime: number = 0;
  let _isRootElementCleared: boolean = false;

  const _renderedElements: Array<RenderedElement> = [];
  const _renderedElementsLookup: RenderedElementsLookup = {};
  const _uiMessageRouter = createRouter({
    dispose: dispose,
    render: render,
    renderBatch: renderBatch,
  });

  if (!_isDOMElementViewDefined) {
    customElements.define("x-dom-element-view", DOMElementView);
  }

  function _createDOMUIElementByRenderMessage(message: MessageDOMUIRender): RenderedElement {
    const domElementView: IDOMElementView = new DOMElementView();
    const renderingContext = resolver.resolve(logger, message, internalDOMMessageChannel.port2, uiMessagePort, domElementView.shadow);

    domElementView.renderingContext = renderingContext;

    const renderedElement: RenderedElement = {
      id: message.id,
      isAppended: false,
      domElementView: domElementView,
      renderingContext: renderingContext,
      styleSheetDirector: Director(logger, tickTimerState, name(renderingContext)),
    };

    renderedElement.styleSheetDirector.start();
    renderedElement.styleSheetDirector.state.next = renderingContext.state.styleSheet;

    _renderedElementsLookup[message.id] = renderedElement;
    _renderedElements.push(renderedElement);

    return renderedElement;
  }

  function _disposeElementById(id: string): void {
    let renderedElement: undefined | RenderedElement = _renderedElementsLookup[id];

    if (!renderedElement) {
      throw new Error(`Element is not rendered and can't be disposed: "${id}"`);

      return;
    }

    logger.info(`REMOVE(${name(renderedElement.renderingContext)})`);

    renderedElement.domElementView.remove();
    delete _renderedElementsLookup[id];
    _renderedElements.splice(_renderedElements.indexOf(renderedElement), 1);
  }

  function _updateRenderedElement(renderedElement: RenderedElement): void {
    renderedElement.styleSheetDirector.update(_delta, _elapsedTime, tickTimerState);

    if (renderedElement.styleSheetDirector.state.isTransitioning || !renderedElement.renderingContext.state.styleSheet.state.isPreloaded) {
      return;
    }

    if (renderedElement.renderingContext.state.styleSheet.state.isPreloaded && !renderedElement.renderingContext.state.styleSheet.state.isMounted) {
      mountMount(logger, renderedElement.renderingContext.state.styleSheet);
    }

    if (!renderedElement.isAppended) {
      logger.info(`APPEND(${name(renderedElement.renderingContext)})`);
      uiRootElement.appendChild(renderedElement.domElementView);
      renderedElement.isAppended = true;
    }

    if (renderedElement.renderingContext.state.styleSheet.state.isMounted) {
      // Update the element only after stylesheet is mounted to prevent
      // graphical glitches.
      renderedElement.domElementView.update(_delta, _elapsedTime, tickTimerState);
    }
  }

  function dispose(message: MessageDOMUIDispose): void {
    message.forEach(_disposeElementById);
  }

  function render(message: MessageDOMUIRender): void {
    let renderedElement: undefined | RenderedElement = _renderedElementsLookup[message.id];

    if (!_isRootElementCleared) {
      clearHTMLElement(uiRootElement);
      _isRootElementCleared = true;
    }

    if (!renderedElement) {
      renderedElement = _createDOMUIElementByRenderMessage(message);
    }

    renderedElement.domElementView.props = message.props;
    renderedElement.domElementView.propsLastUpdate = tickTimerState.currentTick;

    _updateRenderedElement(renderedElement);
  }

  function renderBatch(message: Array<MessageDOMUIRender>): void {
    message.forEach(render);
  }

  function registerMessagePort(messagePort: MessagePort) {
    messagePort.onmessage = _uiMessageRouter;
  }

  function start() {
    internalDOMMessageChannel.port1.onmessage = _uiMessageRouter;
  }

  function stop() {
    internalDOMMessageChannel.port1.onmessage = null;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {
    _delta = delta;
    _elapsedTime = elapsedTime;

    _renderedElements.forEach(_updateRenderedElement);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "DOMUIController",

    dispose: dispose,
    registerMessagePort: registerMessagePort,
    render: render,
    start: start,
    stop: stop,
    update: update,
  });
}
