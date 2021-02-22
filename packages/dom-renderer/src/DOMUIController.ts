import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { createSingleThreadMessageChannel } from "@personalidol/framework/src/createSingleThreadMessageChannel";
import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { mount } from "@personalidol/framework/src/mount";
import { preload } from "@personalidol/framework/src/preload";

import { clearHTMLElement } from "./clearHTMLElement";
import { DOMRenderedElement } from "./DOMRenderedElement";
import { Events } from "./Events.enum";
import { isDOMElementView } from "./isDOMElementView";
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
const _evtOnce = {
  once: true,
};

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

  function _createDOMElementViewBy(elementName: string & keyof T): DOMElementView<U> {
    const DOMElementViewConstructor: HTMLElement = customElements.get(elementName);

    if (!isDOMElementViewConstructor(DOMElementViewConstructor)) {
      throw new Error("Object is not a DOMElementView constructor.");
    }

    return new DOMElementViewConstructor<U>();
  }

  function _createDOMRenderedElementByRenderMessage(message: MessageDOMUIRender<T>): IDOMRenderedElement<T, U> {
    const domElementView: DOMElementView<U> = _createDOMElementViewBy(message.element);

    return _createDOMRenderedElementByView(message.id, message.element, domElementView);
  }

  function _createDOMRenderedElementByView(id: string, elementName: string & keyof T, domElementView: DOMElementView<U>): IDOMRenderedElement<T, U> {
    const renderedElement: IDOMRenderedElement<T, U> = DOMRenderedElement<T, U>(
      logger,
      id,
      elementName,
      inputState,
      domElementView,
      tickTimerState,
      userSettings,
      internalDOMMessageChannel.port2,
      uiMessagePort
    );

    preload(logger, renderedElement);

    _renderedElementsLookup.set(id, renderedElement);
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

    uiRootElement.removeChild(renderedElement.domElementView);
  }

  function _findDOMRenderedElementByView(domElementView: DOMElementView<U>): null | IDOMRenderedElement<T, U> {
    for (let renderedElement of _renderedElements) {
      if (renderedElement.domElementView === domElementView) {
        return renderedElement;
      }
    }

    return null;
  }

  function _getCustomElementConstructor<N extends string & keyof T>(elementName: N): T[N] {
    const ElementConstructor = domElementsLookup[elementName];

    if (!ElementConstructor) {
      throw new Error(`Custom element is not available: "${elementName}"`);
    }

    return ElementConstructor;
  }

  function _onElementConnected(evt: any) {
    const target = evt.detail;

    if (!isDOMElementView<U>(target)) {
      throw new Error(`Received event, but element is not a DOMElementView: "${Events.elementConnected}"`);
    }

    const renderedElement: null | IDOMRenderedElement<T, U> = _findDOMRenderedElementByView(target);

    if (null === renderedElement) {
      _createDOMRenderedElementByView(MathUtils.generateUUID(), target.tagName.toLowerCase() as string & keyof T, target);
    }

    target.addEventListener(Events.elementDisconnected, _onElementDisconnected, _evtOnce);
  }

  function _onElementDisconnected(evt: any) {
    const target = evt.detail;

    if (!isDOMElementView<U>(target)) {
      throw new Error(`Received event, but element is not a DOMElementView: "${Events.elementDisconnected}"`);
    }

    const renderedElement: null | IDOMRenderedElement<T, U> = _findDOMRenderedElementByView(target);

    if (null === renderedElement) {
      console.error("Unable to find rendered element by view.", target);
      throw new Error("Unable to find rendered element by view.");
    }

    fDispose(logger, renderedElement);
    _renderedElementsLookup.delete(renderedElement.id);
    _renderedElements.delete(renderedElement);
  }

  function _updateRenderedElement(renderedElement: IDOMRenderedElement<T, U>) {
    if (!renderedElement.state.isPreloaded) {
      return;
    }

    if (renderedElement.state.isPreloaded && !renderedElement.state.isMounted) {
      mount(logger, renderedElement);
    }

    if (!renderedElement.domElementView.isConnected) {
      uiRootElement.appendChild(renderedElement.domElementView);
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

    let renderedElement: undefined | IDOMRenderedElement<T, U> = _renderedElementsLookup.get(message.id);

    if (!renderedElement) {
      renderedElement = _createDOMRenderedElementByRenderMessage(message);
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
    for (let customElementName of Object.keys(domElementsLookup)) {
      if (!_isCustomElementDefined<T>(customElementName as string & keyof T)) {
        _defineCustomElementByName(customElementName as string & keyof T);
      }
    }

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
    registerMessagePort: registerMessagePort,
    render: render,
    start: start,
    stop: stop,
    update: update,
  });
}
