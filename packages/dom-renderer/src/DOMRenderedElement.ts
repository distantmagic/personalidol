import { MathUtils } from "three/src/math/MathUtils";

import { Director } from "@personalidol/loading-manager/src/Director";
import { mountMount } from "@personalidol/framework/src/mountMount";

import type { Logger } from "loglevel";

import type { Director as IDirector } from "@personalidol/loading-manager/src/Director.interface";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementView } from "./DOMElementView.interface";
import type { DOMRenderedElement as IDOMRenderedElement } from "./DOMRenderedElement.interface";
import type { ReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";

export function DOMRenderedElement(
  logger: Logger,
  id: string,
  element: string,
  uiRootElement: HTMLElement,
  domElementView: DOMElementView,
  tickTimerState: TickTimerState,
  domMessagePort: MessagePort,
  uiMessagePort: MessagePort
): IDOMRenderedElement {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _styleSheetDirector: IDirector = Director(logger, tickTimerState, id);

  function dispose() {
    state.isDisposed = true;
  }

  function mount() {
    state.isMounted = true;

    _styleSheetDirector.start();
    uiRootElement.appendChild(domElementView);
  }

  function unmount() {
    state.isMounted = false;

    _styleSheetDirector.stop();
    uiRootElement.removeChild(domElementView);
  }

  function preload() {
    state.isPreloading = true;

    domElementView.domMessagePort = domMessagePort;
    domElementView.uiMessagePort = uiMessagePort;

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {
    const styleSheet: null | ReplaceableStyleSheet = domElementView.styleSheet;

    if (!styleSheet) {
      return;
    }

    if (_styleSheetDirector.state.current !== styleSheet && !_styleSheetDirector.state.isTransitioning) {
      _styleSheetDirector.state.next = styleSheet;
    }

    _styleSheetDirector.update(delta, elapsedTime, tickTimerState);

    if (styleSheet.state.isPreloaded && !styleSheet.state.isMounted) {
      mountMount(logger, styleSheet);
    }

    if (!styleSheet.state.isMounted) {
      return;
    }

    styleSheet.update(delta, elapsedTime, tickTimerState);

    // Only render view after stylesheet is ready to prevent UI visual flashes.
    domElementView.update(delta, elapsedTime, tickTimerState);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isDOMRenderedElement: true,
    name: `DOMRenderedElement("${element}")`,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
    updateProps: domElementView.updateProps,
  });
}
