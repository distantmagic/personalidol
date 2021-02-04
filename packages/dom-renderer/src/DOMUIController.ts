import { MathUtils } from "three/src/math/MathUtils";

import { createMessageChannel } from "@personalidol/framework/src/createMessageChannel";
import { createRouter } from "@personalidol/framework/src/createRouter";
import { mountDispose } from "@personalidol/framework/src/mountDispose";
import { mountMount } from "@personalidol/framework/src/mountMount";
import { mountPreload } from "@personalidol/framework/src/mountPreload";

import { clearHTMLElement } from "./clearHTMLElement";
import { DOMRenderedElement } from "./DOMRenderedElement";

import type { Logger } from "loglevel";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { DOMElementView } from "./DOMElementView.interface";
import type { DOMRenderedElement as IDOMRenderedElement } from "./DOMRenderedElement.interface";
import type { DOMUIController as IDOMUIController } from "./DOMUIController.interface";
import type { MessageDOMUIDispose } from "./MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";

const _definedCustomElements: Array<string> = [];

function _isCustomElementDefined(name: string): boolean {
  return _definedCustomElements.includes(name);
}

async function _defineCustomElement(logger: Logger, name: string, element: typeof HTMLElement): Promise<void> {
  if (_isCustomElementDefined(name)) {
    throw new Error(`Custom element is already defined: "${name}"`);
  }

  customElements.define(name, element);
  _definedCustomElements.push(name);

  await customElements.whenDefined(name);

  logger.info(`DEFINE("${name}")`);
}

export function DOMUIController(
  logger: Logger,
  tickTimerState: TickTimerState,
  uiMessagePort: MessagePort,
  uiRootElement: HTMLElement,
  domElementsLookup: DOMElementsLookup
): IDOMUIController {
  const internalDOMMessageChannel: MessageChannel = createMessageChannel();
  let _delta: number = 0;
  let _elapsedTime: number = 0;
  let _isRootElementCleared: boolean = false;

  const _renderedElements: Set<IDOMRenderedElement> = new Set();
  const _renderedElementsLookup: Map<string, IDOMRenderedElement> = new Map();
  const _uiMessageRouter = createRouter({
    dispose: dispose,
    render: render,
    renderBatch: renderBatch,
  });

  function _createDOMUIElementByRenderMessage(message: MessageDOMUIRender): IDOMRenderedElement {
    const DOMElementConstructor = customElements.get(message.element);

    if (!DOMElementConstructor) {
      throw new Error(`Custom element is not registered: "${message.element}"`);
    }

    const domElementView: DOMElementView = new DOMElementConstructor();
    const renderedElement: IDOMRenderedElement = DOMRenderedElement(
      logger,
      message.id,
      message.element,
      uiRootElement,
      domElementView,
      tickTimerState,
      internalDOMMessageChannel.port2,
      uiMessagePort
    );

    mountPreload(logger, renderedElement);

    _renderedElementsLookup.set(message.id, renderedElement);
    _renderedElements.add(renderedElement);

    return renderedElement;
  }

  function _defineCustomElementByName(elementName: string): void {
    _defineCustomElement(logger, elementName, _getCustomElementConstructor(elementName));
  }

  function _disposeElementById(id: string): void {
    let renderedElement: undefined | IDOMRenderedElement = _renderedElementsLookup.get(id);

    if (!renderedElement) {
      throw new Error(`Element is not rendered and can't be disposed: "${id}"`);

      return;
    }

    mountDispose(logger, renderedElement);

    _renderedElementsLookup.delete(id);
    _renderedElements.delete(renderedElement);
  }

  function _getCustomElementConstructor(elementName: string): typeof HTMLElement {
    const ElementConstructor = domElementsLookup[elementName];

    if (!ElementConstructor) {
      throw new Error(`Custom element is not available: "${elementName}"`);
    }

    return ElementConstructor;
  }

  function _updateRenderedElement(renderedElement: IDOMRenderedElement) {
    if (!renderedElement.state.isPreloaded) {
      return;
    }

    if (renderedElement.state.isPreloaded && !renderedElement.state.isMounted) {
      mountMount(logger, renderedElement);
    }

    if (renderedElement.state.isMounted) {
      renderedElement.update(_delta, _elapsedTime, tickTimerState);
    }
  }

  function dispose(message: MessageDOMUIDispose): void {
    message.forEach(_disposeElementById);
  }

  function render(message: MessageDOMUIRender): void {
    if (!_isRootElementCleared) {
      clearHTMLElement(uiRootElement);
      _isRootElementCleared = true;
    }

    if (!_isCustomElementDefined(message.element)) {
      _defineCustomElementByName(message.element);
    }

    let renderedElement: undefined | IDOMRenderedElement = _renderedElementsLookup.get(message.id);

    if (!renderedElement) {
      renderedElement = _createDOMUIElementByRenderMessage(message);
    }

    renderedElement.updateProps(message.props, tickTimerState);

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
