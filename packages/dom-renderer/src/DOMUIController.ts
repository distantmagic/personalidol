import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { createSingleThreadMessageChannel } from "@personalidol/framework/src/createSingleThreadMessageChannel";
import { isCustomEvent } from "@personalidol/framework/src/isCustomEvent";

import { clearHTMLElement } from "./clearHTMLElement";
import { Events } from "./Events.enum";
import { isDOMElementView } from "./isDOMElementView";
import { isDOMElementViewConstructor } from "./isDOMElementViewConstructor";
import { isHTMLElementConstructor } from "./isHTMLElementConstructor";

import type { i18n } from "i18next";
import type { Logger } from "loglevel";

import type { MainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { DOMElementView } from "./DOMElementView.interface";
import type { DOMUIController as IDOMUIController } from "./DOMUIController.interface";
import type { DOMUIControllerState } from "./DOMUIControllerState.type";
import type { MessageDOMUIDispose } from "./MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";

const _definedCustomElements: Array<string> = [];
const _evtOnce = Object.freeze({
  once: true,
});

function _initializeDOMElementView<U extends UserSettings>(
  domElementView: DOMElementView<U>,
  i18next: i18n,
  userSettings: U,
  inputState: Int32Array,
  domMessagePort: MessagePort,
  uiMessagePort: MessagePort
) {
  domElementView.domMessagePort = domMessagePort;
  domElementView.i18next = i18next;
  domElementView.inputState = inputState;
  domElementView.uiMessagePort = uiMessagePort;
  domElementView.userSettings = userSettings;
}

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
  i18next: i18n,
  inputState: Int32Array,
  mainLoop: MainLoop,
  uiMessagePort: MessagePort,
  uiRootElement: HTMLElement,
  userSettings: U,
  domElementsLookup: L
): IDOMUIController<L, U> {
  const state: DOMUIControllerState = Object.seal({
    isPreloaded: false,
    isPreloading: false,
  });
  const internalDOMMessageChannel: MessageChannel = createSingleThreadMessageChannel();
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

    _initializeDOMElementView(domElementView, i18next, userSettings, inputState, internalDOMMessageChannel.port2, uiMessagePort);

    return domElementView;
  }

  function _defineCustomElementByName(elementName: string & keyof L): Promise<void> {
    const Constructor = domElementsLookup[elementName];

    if (!Constructor) {
      throw new Error(`Custom element is not available: "${elementName}"`);
    }

    if (!isHTMLElementConstructor(Constructor)) {
      throw new Error("Object is not a HTMLElement constructor.");
    }

    return _defineCustomElement<L>(logger, elementName, Constructor);
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

    _initializeDOMElementView(target, i18next, userSettings, inputState, internalDOMMessageChannel.port2, uiMessagePort);
    _registerDOMElementView(target);
    _updateRenderedElement(target);

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

    if (mainLoop.updatables.has(target)) {
      // Element may remove itself from the update loop, so it's fine if it is
      // no longer in the main loop.
      mainLoop.updatables.delete(target);
    }

    if (!_domElementViews.delete(target)) {
      throw new Error(`Element was disconnected, but has never been registered as connected: "${target.tagName}"`);
    }
  }

  function _registerDOMElementView(domElementView: DOMElementView<U>) {
    _domElementViews.add(domElementView);
    mainLoop.updatables.add(domElementView);
  }

  function _updateRenderedElement(domElementView: DOMElementView<U>) {
    if (domElementView.state.needsUpdates) {
      domElementView.update(mainLoop.tickTimerState.delta, mainLoop.tickTimerState.elapsedTime, mainLoop.tickTimerState);
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

  function dispose(message: MessageDOMUIDispose): void {
    message.forEach(_disposeElementById);
  }

  async function preload() {
    state.isPreloading = true;

    const preloading = [];

    for (let customElementName of Object.keys(domElementsLookup)) {
      if (!_isCustomElementDefined<L>(customElementName as string & keyof L)) {
        preloading.push(_defineCustomElementByName(customElementName as string & keyof L));
      }
    }

    await Promise.all(preloading);

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function render(message: MessageDOMUIRender<L>): void {
    if (!_isRootElementCleared) {
      clearHTMLElement(uiRootElement);
      _isRootElementCleared = true;
    }

    let domElementView: undefined | DOMElementView<U> = _managedDOMElementViewsLookup.get(message.id);

    if (!domElementView) {
      domElementView = _createDOMElementViewByRenderMessage(message);

      _registerDOMElementView(domElementView);

      _managedDOMElementViewsLookup.set(message.id, domElementView);
      uiRootElement.appendChild(domElementView);
    }

    _updateRenderedElementProps(domElementView, message.props);

    if (!domElementView.state.needsUpdates) {
      throw new Error(`DOMElementView requested no more updates, but render message was received: "${domElementView.tagName}"`);
    }

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

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "DOMUIController",
    state: state,

    dispose: dispose,
    preload: preload,
    registerMessagePort: registerMessagePort,
    render: render,
    start: start,
    stop: stop,
  });
}
