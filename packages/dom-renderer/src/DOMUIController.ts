import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { createSingleThreadMessageChannel } from "@personalidol/framework/src/createSingleThreadMessageChannel";
import { isCustomEvent } from "@personalidol/framework/src/isCustomEvent";

import { clearHTMLElement } from "./clearHTMLElement";
import { Events } from "./Events.enum";
import { initializeDOMElementView } from "./initializeDOMElementView";
import { isDOMElementView } from "./isDOMElementView";
import { isDOMElementViewConstructor } from "./isDOMElementViewConstructor";
import { isHTMLElementConstructor } from "./isHTMLElementConstructor";

import type { Logger } from "loglevel";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementProps } from "./DOMElementProps.type";
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

  const _domElementViews: Set<DOMElementView<U>> = new Set();
  const _managedDOMElementViewsLookup: Map<string, DOMElementView<U>> = new Map();
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

    initializeDOMElementView(domElementView, userSettings, inputState, internalDOMMessageChannel.port2, uiMessagePort);

    return domElementView;
  }

  function _defineCustomElementByName(elementName: string & keyof L): void {
    const Constructor = domElementsLookup[elementName];

    if (!Constructor) {
      throw new Error(`Custom element is not available: "${elementName}"`);
    }

    if (!isHTMLElementConstructor(Constructor)) {
      throw new Error("Object is not a HTMLElement constructor.");
    }

    _defineCustomElement<L>(logger, elementName, Constructor);
  }

  function _disposeElementById(id: string): void {
    let domElementView: undefined | DOMElementView<U> = _managedDOMElementViewsLookup.get(id);

    if (!domElementView) {
      throw new Error(`Element is not rendered and can't be disposed: "${id}"`);

      return;
    }

    uiRootElement.removeChild(domElementView);

    _domElementViews.delete(domElementView);
    _managedDOMElementViewsLookup.delete(id);
  }

  function _onElementConnected(evt: Event) {
    evt.stopPropagation();

    if (!isCustomEvent(evt)) {
      throw new Error(`Expected custom event for: "${Events.elementConnected}"`);
    }

    const target = evt.detail;

    if (!isDOMElementView<U>(target)) {
      throw new Error(`Received event, but element is not a DOMElementView: "${target.tagName}@${Events.elementConnected}"`);
    }

    if (_domElementViews.has(target)) {
      return;
    }

    // Pick up any element that was created by a view.

    initializeDOMElementView(target, userSettings, inputState, internalDOMMessageChannel.port2, uiMessagePort);
    _updateRenderedElement(target);

    _domElementViews.add(target);
    target.addEventListener(Events.elementDisconnected, _onElementDisconnected, _evtOnce);
  }

  function _onElementDisconnected(evt: Event) {
    evt.stopPropagation();

    if (!isCustomEvent(evt)) {
      throw new Error(`Expected custom event for: "${Events.elementDisconnected}"`);
    }

    const target = evt.detail;

    if (!isDOMElementView<U>(target)) {
      throw new Error(`Received event, but element is not a DOMElementView: "${target.tagName}@${Events.elementDisconnected}"`);
    }

    if (!_domElementViews.delete(target)) {
      throw new Error(`Element was disconnected, but has never been registered as connected: "${target.tagName}"`);
    }
  }

  function _updateRenderedElementProps(domElementView: DOMElementView<U>, props: DOMElementProps) {
    for (let prop in props) {
      if (props.hasOwnProperty(prop)) {
        if (prop in domElementView) {
          // @ts-ignore we know that element has this property
          domElementView[prop] = props[prop];
        } else {
          throw new Error(`Element does not have a property defined: "${domElementView.tagName}.${prop}"`);
        }
      }
    }
  }

  function _updateRenderedElement(domElementView: DOMElementView<U>) {
    if (domElementView.isConnected) {
      domElementView.update(_delta, _elapsedTime, tickTimerState);
    }
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

    let domElementView: undefined | DOMElementView<U> = _managedDOMElementViewsLookup.get(message.id);

    if (!domElementView) {
      domElementView = _createDOMElementViewByRenderMessage(message);

      _domElementViews.add(domElementView);
      _managedDOMElementViewsLookup.set(message.id, domElementView);

      uiRootElement.appendChild(domElementView);
    }

    _updateRenderedElementProps(domElementView, message.props);
    _updateRenderedElement(domElementView);
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

    _domElementViews.forEach(_updateRenderedElement);
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
