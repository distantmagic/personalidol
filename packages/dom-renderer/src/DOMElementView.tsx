import { h, render } from 'preact';

import { Director } from "@personalidol/loading-manager/src/Director";
import { mountMount } from "@personalidol/framework/src/mountMount";

import type { Logger } from "loglevel";
import type { VNode } from "preact";

import type { Director as IDirector } from "@personalidol/loading-manager/src/Director.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementView as IDOMElementView } from "./DOMElementView.interface";
import type { ReplaceableStyleSheet as IReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";

export abstract class DOMElementView extends HTMLElement implements IDOMElementView {
  public domMessagePort: null | MessagePort = null;
  public logger: null | Logger = null;
  public needsRender: boolean = true;
  public props: DOMElementProps = {};
  public propsLastUpdate: number = -1;
  public rootElement: HTMLDivElement;
  public shadow: ShadowRoot;
  public styleSheet: null | IReplaceableStyleSheet = null;
  public styleSheetDirector: null | IDirector = null;
  public tickTimerState: null | TickTimerState = null;
  public uiMessagePort: null | MessagePort = null;
  public viewLastUpdate: number = -1;

  constructor() {
    super();

    this.render = this.render.bind(this);

    this.shadow = this.attachShadow({
      mode: "open",
    });

    this.rootElement = document.createElement("div");
    this.shadow.appendChild(this.rootElement);
  }

  connectedCallback() {
    const styleSheetDirector: null | IDirector = this.styleSheetDirector;

    this.needsRender = true;

    if (styleSheetDirector) {
      styleSheetDirector.start();
    }
  }

  disconnectedCallback() {
    const styleSheetDirector: null | IDirector = this.styleSheetDirector;

    if (styleSheetDirector) {
      styleSheetDirector.stop();
    }

    this.needsRender = false;
    render(null, this.rootElement);
  }

  init(
    logger: Logger,
    domMessagePort: MessagePort,
    uiMessagePort: MessagePort,
    tickTimerState: TickTimerState,
  ): void {
    this.domMessagePort = domMessagePort;
    this.logger = logger;
    this.styleSheetDirector = Director(logger, tickTimerState, "DOMElementView");
    this.tickTimerState = tickTimerState;
    this.uiMessagePort = uiMessagePort;
  }

  render(): null | VNode<any> {
    return null;
  }

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    const logger: null | Logger = this.logger;
    const styleSheet: null | IReplaceableStyleSheet = this.styleSheet;
    const styleSheetDirector: null | IDirector = this.styleSheetDirector;

    if (styleSheetDirector) {
      if (styleSheet && styleSheetDirector.state.current !== styleSheet && !styleSheetDirector.state.isTransitioning) {
        styleSheetDirector.state.next = styleSheet;
      }

      styleSheetDirector.update(delta, elapsedTime, tickTimerState);

      if (logger && styleSheet && styleSheet.state.isPreloaded) {
        if (!styleSheet.state.isMounted) {
          mountMount(logger, styleSheet);
        }

        styleSheet.update(delta, elapsedTime, tickTimerState);
      }
    }

    // Render view only after CSS stylesheet is attached to reduce visual
    // flashes.
    if (this.needsRender && styleSheet && styleSheet.state.isMounted) {
      render((
        <this.render />
      ), this.rootElement);
      this.needsRender = false;
    }
  }
}
