import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { createSingleThreadMessageChannel } from "@personalidol/framework/src/createSingleThreadMessageChannel";

import { clearHTMLElement } from "./clearHTMLElement";
import { Events } from "./Events.enum";
import { isDOMElementView } from "./isDOMElementView";
import { isDOMElementViewConstructor } from "./isDOMElementViewConstructor";
import { isHTMLElementConstructor } from "./isHTMLElementConstructor";

import type { Logger } from "loglevel";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { DOMElementView } from "./DOMElementView.interface";
import type { DOMUIController as IDOMUIController } from "./DOMUIController.interface";
import type { MessageDOMUIDispose } from "./MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";

const _definedCustomElements: Array<string> = [];
const _evtOnce = {
  once: true,
};

function _isCustomElementDefined<L extends DOMElementsLookup>(name: string & keyof L): boolean {
  return _definedCustomElements.includes(name);
}

async function _defineCustomElement<L extends DOMElementsLookup>(logger: Logger, name: string & keyof L, element: typeof HTMLElement): Promise<void> {
  if (_isCustomElementDefined<L>(name)) {
    throw new Error(`Custom element is already defined: "${name}"`);
  }

  customElements.define(name, element);
  _definedCustomElements.push(name);

  await customElements.whenDefined(name);

  logger.info(`DEFINE("${name}")`);
}

export function DOMUIController<L extends DOMElementsLookup, U extends UserSettings>(
  logger: Logger,
  inputState: Int32Array,
  tickTimerState: TickTimerState,
  uiMessagePort: MessagePort,
  uiRootElement: HTMLElement,
  userSettings: U,
  domElementsLookup: L
): IDOMUIController<L, U> {
  const internalDOMMessageChannel: MessageChannel = createSingleThreadMessageChannel();
  let _delta: number = 0;
  let _elapsedTime: number = 0;
  let _isRootElementCleared: boolean = false;

  const _renderedElements: Set<DOMElementView<U>> = new Set();
  const _renderedElementsLookup: Map<string, DOMElementView<U>> = new Map();
  const _uiMessageRouter = createRouter({
    dispose: dispose,
    render: render,
    renderBatch: renderBatch,
  });

  function _createDOMElementViewByRenderMessage(message: MessageDOMUIRender<L>): DOMElementView<U> {
    const DOMElementViewConstructor: HTMLElement = customElements.get(message.element);

    if (!isDOMElementViewConstructor(DOMElementViewConstructor)) {
      throw new Error("Object is not a DOMElementView constructor.");
    }

    const domElementView = new DOMElementViewConstructor<U>();

    _initializeDOMElementView(domElementView);

    return domElementView;
  }

  function _defineCustomElementByName(elementName: string & keyof L): void {
    const Constructor = _getCustomElementConstructor(elementName);

    if (!isHTMLElementConstructor(Constructor)) {
      throw new Error("Object is not a HTMLElement constructor.");
    }

    _defineCustomElement<L>(logger, elementName, Constructor);
  }

  function _disposeElementById(id: string): void {
    let renderedElement: undefined | DOMElementView<U> = _renderedElementsLookup.get(id);

    if (!renderedElement) {
      throw new Error(`Element is not rendered and can't be disposed: "${id}"`);

      return;
    }

    uiRootElement.removeChild(renderedElement);

    _renderedElements.delete(renderedElement);
    _renderedElementsLookup.delete(id);
  }

  function _getCustomElementConstructor<N extends string & keyof L>(elementName: N): L[N] {
    const ElementConstructor = domElementsLookup[elementName];

    if (!ElementConstructor) {
      throw new Error(`Custom element is not available: "${elementName}"`);
    }

    return ElementConstructor;
  }

  function _initializeDOMElementView(domElementView: DOMElementView<U>) {
    domElementView.domMessagePort = internalDOMMessageChannel.port2;
    domElementView.inputState = inputState;
    domElementView.uiMessagePort = uiMessagePort;
    domElementView.userSettings = userSettings;
  }

  function _onElementConnected(evt: any) {
    evt.stopPropagation();

    const target = evt.detail;

    if (!isDOMElementView<U>(target)) {
      throw new Error(`Received event, but element is not a DOMElementView: "${Events.elementConnected}"`);
    }

    if (!_renderedElements.has(target)) {
      _initializeDOMElementView(target);
      _renderedElements.add(target);
    }

    target.addEventListener(Events.elementDisconnected, _onElementDisconnected, _evtOnce);
  }

  function _onElementDisconnected(evt: any) {
    evt.stopPropagation();

    const target = evt.detail;

    if (!isDOMElementView<U>(target)) {
      throw new Error(`Received event, but element is not a DOMElementView: "${Events.elementDisconnected}"`);
    }

    if (!_renderedElements.delete(target)) {
      throw new Error("Element was disconnected, but has never been registered as connected.");
    }
  }

  function _updateRenderedElement(renderedElement: DOMElementView<U>) {
    renderedElement.update(_delta, _elapsedTime, tickTimerState);
  }

  function dispose(message: MessageDOMUIDispose): void {
    message.forEach(_disposeElementById);
  }

  function preload() {
    for (let customElementName of Object.keys(domElementsLookup)) {
      if (!_isCustomElementDefined<L>(customElementName as string & keyof L)) {
        _defineCustomElementByName(customElementName as string & keyof L);
      }
    }
  }

  function render(message: MessageDOMUIRender<L>): void {
    if (!_isRootElementCleared) {
      clearHTMLElement(uiRootElement);
      _isRootElementCleared = true;
    }

    let renderedElement: undefined | DOMElementView<U> = _renderedElementsLookup.get(message.id);

    if (!renderedElement) {
      renderedElement = _createDOMElementViewByRenderMessage(message);

      _renderedElements.add(renderedElement);
      _renderedElementsLookup.set(message.id, renderedElement);

      uiRootElement.appendChild(renderedElement);
    }

    renderedElement.updateProps(message.props, tickTimerState);

    _updateRenderedElement(renderedElement);
  }

  function renderBatch(message: Array<MessageDOMUIRender<L>>): void {
    message.forEach(render);
  }

  function registerMessagePort(messagePort: MessagePort) {
    messagePort.onmessage = _uiMessageRouter;
  }

  function start() {
    internalDOMMessageChannel.port1.onmessage = _uiMessageRouter;
    uiRootElement.addEventListener(Events.elementConnected, _onElementConnected);
  }

  function stop() {
    internalDOMMessageChannel.port1.onmessage = null;
    uiRootElement.removeEventListener(Events.elementConnected, _onElementConnected);
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
    preload: preload,
    registerMessagePort: registerMessagePort,
    render: render,
    start: start,
    stop: stop,
    update: update,
  });
}
