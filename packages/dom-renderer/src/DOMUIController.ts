import { MathUtils } from "three/src/math/MathUtils";

import { createMessageChannel } from "@personalidol/framework/src/createMessageChannel";
import { createRouter } from "@personalidol/framework/src/createRouter";
import { name } from "@personalidol/framework/src/name";

import { clearHTMLElement } from "./clearHTMLElement";

import type { Logger } from "loglevel";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { DOMElementView } from "./DOMElementView.interface";
import type { DOMUIController as IDOMUIController } from "./DOMUIController.interface";
import type { MessageDOMUIDispose } from "./MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";

type RenderedElement = {
  domElementView: DOMElementView;
  id: string;
};

type RenderedElementsLookup = {
  [key: string]: RenderedElement;
};

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

  logger.info(`REGISTER_CUSTOM_ELEMENT("${name}")`);
}

export function DOMUIController(
  logger: Logger,
  tickTimerState: TickTimerState,
  uiMessagePort: MessagePort,
  uiRootElement: HTMLElement,
  domElementsLookup: DOMElementsLookup
): IDOMUIController {
  const internalDOMMessageChannel: MessageChannel = createMessageChannel();
  let _isRootElementCleared: boolean = false;

  const _renderedElements: Array<RenderedElement> = [];
  const _renderedElementsLookup: RenderedElementsLookup = {};
  const _uiMessageRouter = createRouter({
    dispose: dispose,
    render: render,
  });

  function _createDOMUIElementByRenderMessage(message: MessageDOMUIRender): RenderedElement {
    const DOMElementConstructor = customElements.get(message.element);

    if (!DOMElementConstructor) {
      throw new Error(`Custom element is not registered: "${message.element}"`);
    }

    const domElementView: DOMElementView = new DOMElementConstructor();

    domElementView.init(logger, internalDOMMessageChannel.port2, uiMessagePort, tickTimerState);

    const renderedElement: RenderedElement = {
      id: message.id,
      domElementView: domElementView,
    };

    _renderedElementsLookup[message.id] = renderedElement;
    _renderedElements.push(renderedElement);

    logger.info(`MOUNT.DOM(${name(domElementView.nameable)})`);

    return renderedElement;
  }

  function _definedCustomElementByName(elementName: string): void {
    if (_isCustomElementDefined(elementName)) {
      return;
    }

    const ElementConstructor = domElementsLookup[elementName];

    if (!ElementConstructor) {
      throw new Error(`Custom element is not available: "${elementName}"`);
    }

    _defineCustomElement(logger, elementName, ElementConstructor);
  }

  function _disposeElementById(id: string): void {
    let renderedElement: undefined | RenderedElement = _renderedElementsLookup[id];

    if (!renderedElement) {
      throw new Error(`Element is not rendered and can't be disposed: "${id}"`);

      return;
    }

    logger.info(`DISPOSE.DOM(${name(renderedElement.domElementView.nameable)})`);

    renderedElement.domElementView.remove();
    delete _renderedElementsLookup[id];
    _renderedElements.splice(_renderedElements.indexOf(renderedElement), 1);
  }

  function dispose(message: MessageDOMUIDispose): void {
    message.forEach(_disposeElementById);
  }

  function render(message: MessageDOMUIRender): void {
    _definedCustomElementByName(message.element);

    let renderedElement: undefined | RenderedElement = _renderedElementsLookup[message.id];

    if (!_isRootElementCleared) {
      clearHTMLElement(uiRootElement);
      _isRootElementCleared = true;
    }

    if (!renderedElement) {
      renderedElement = _createDOMUIElementByRenderMessage(message);
      uiRootElement.appendChild(renderedElement.domElementView);
    }

    renderedElement.domElementView.props = message.props;
    renderedElement.domElementView.propsLastUpdate = tickTimerState.currentTick;
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
    for (let renderedElement of _renderedElements) {
      renderedElement.domElementView.update(delta, elapsedTime, tickTimerState);
    }
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
