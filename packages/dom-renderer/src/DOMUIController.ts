import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { createSingleThreadMessageChannel } from "@personalidol/framework/src/createSingleThreadMessageChannel";
import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { mount } from "@personalidol/framework/src/mount";
import { preload } from "@personalidol/framework/src/preload";

import { clearHTMLElement } from "./clearHTMLElement";
import { DOMRenderedElement } from "./DOMRenderedElement";
import { isDOMElementViewConstructor } from "./isDOMElementViewConstructor";
import { isHTMLElementConstructor } from "./isHTMLElementConstructor";

import type { Logger } from "loglevel";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { DOMElementView } from "./DOMElementView.interface";
import type { DOMRenderedElement as IDOMRenderedElement } from "./DOMRenderedElement.interface";
import type { DOMUIController as IDOMUIController } from "./DOMUIController.interface";
import type { MessageDOMUIDispose } from "./MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";

const _definedCustomElements: Array<string> = [];

function _isCustomElementDefined<T extends DOMElementsLookup>(name: string & keyof T): boolean {
  return _definedCustomElements.includes(name);
}

async function _defineCustomElement<T extends DOMElementsLookup>(logger: Logger, name: string & keyof T, element: typeof HTMLElement): Promise<void> {
  if (_isCustomElementDefined<T>(name)) {
    throw new Error(`Custom element is already defined: "${name}"`);
  }

  customElements.define(name, element);
  _definedCustomElements.push(name);

  await customElements.whenDefined(name);

  logger.info(`DEFINE("${name}")`);
}

export function DOMUIController<T extends DOMElementsLookup, U extends UserSettings>(
  logger: Logger,
  inputState: Int32Array,
  tickTimerState: TickTimerState,
  uiMessagePort: MessagePort,
  uiRootElement: HTMLElement,
  userSettings: U,
  domElementsLookup: T
): IDOMUIController<T, U> {
  const internalDOMMessageChannel: MessageChannel = createSingleThreadMessageChannel();
  let _delta: number = 0;
  let _elapsedTime: number = 0;
  let _isRootElementCleared: boolean = false;

  const _renderedElements: Set<IDOMRenderedElement<T, U>> = new Set();
  const _renderedElementsLookup: Map<string, IDOMRenderedElement<T, U>> = new Map();
  const _uiMessageRouter = createRouter({
    dispose: dispose,
    render: render,
    renderBatch: renderBatch,
  });

  function _createDOMUIElementByRenderMessage(message: MessageDOMUIRender<T>): IDOMRenderedElement<T, U> {
    const DOMElementViewConstructor: HTMLElement = customElements.get(message.element);

    if (!isDOMElementViewConstructor(DOMElementViewConstructor)) {
      throw new Error("Object is not a DOMElementView constructor.");
    }

    const domElementView: DOMElementView<U> = new DOMElementViewConstructor<U>();
    const renderedElement: IDOMRenderedElement<T, U> = DOMRenderedElement<T, U>(
      logger,
      message.id,
      message.element,
      inputState,
      uiRootElement,
      domElementView,
      tickTimerState,
      userSettings,
      internalDOMMessageChannel.port2,
      uiMessagePort
    );

    preload(logger, renderedElement);

    _renderedElementsLookup.set(message.id, renderedElement);
    _renderedElements.add(renderedElement);

    return renderedElement;
  }

  function _defineCustomElementByName(elementName: string & keyof T): void {
    const Constructor = _getCustomElementConstructor(elementName);

    if (!isHTMLElementConstructor(Constructor)) {
      throw new Error("Object is not a HTMLElement constructor.");
    }

    _defineCustomElement<T>(logger, elementName, Constructor);
  }

  function _disposeElementById(id: string): void {
    let renderedElement: undefined | IDOMRenderedElement<T, U> = _renderedElementsLookup.get(id);

    if (!renderedElement) {
      throw new Error(`Element is not rendered and can't be disposed: "${id}"`);

      return;
    }

    fDispose(logger, renderedElement);

    _renderedElementsLookup.delete(id);
    _renderedElements.delete(renderedElement);
  }

  function _getCustomElementConstructor<N extends string & keyof T>(elementName: N): T[N] {
    const ElementConstructor = domElementsLookup[elementName];

    if (!ElementConstructor) {
      throw new Error(`Custom element is not available: "${elementName}"`);
    }

    return ElementConstructor;
  }

  function _updateRenderedElement(renderedElement: IDOMRenderedElement<T, U>) {
    if (!renderedElement.state.isPreloaded) {
      return;
    }

    if (renderedElement.state.isPreloaded && !renderedElement.state.isMounted) {
      mount(logger, renderedElement);
    }

    if (renderedElement.state.isMounted) {
      renderedElement.update(_delta, _elapsedTime, tickTimerState);
    }
  }

  function dispose(message: MessageDOMUIDispose): void {
    message.forEach(_disposeElementById);
  }

  function render(message: MessageDOMUIRender<T>): void {
    if (!_isRootElementCleared) {
      clearHTMLElement(uiRootElement);
      _isRootElementCleared = true;
    }

    if (!_isCustomElementDefined<T>(message.element)) {
      _defineCustomElementByName(message.element);
    }

    let renderedElement: undefined | IDOMRenderedElement<T, U> = _renderedElementsLookup.get(message.id);

    if (!renderedElement) {
      renderedElement = _createDOMUIElementByRenderMessage(message);
    }

    renderedElement.updateProps(message.props, tickTimerState);

    _updateRenderedElement(renderedElement);
  }

  function renderBatch(message: Array<MessageDOMUIRender<T>>): void {
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
