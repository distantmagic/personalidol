// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import yn from "yn";

import HTMLElementResizeObserver from "../HTMLElementResizeObserver";
// import HTMLElementSize from "../HTMLElementSize";
import Idempotence from "../Exception/Idempotence";
import KeyboardState from "../KeyboardState";
import LoggerBreadcrumbs from "../LoggerBreadcrumbs";
import MainLoop from "../MainLoop";
// import MainView from "../../../app/classes/MainView";
import PointerState from "../PointerState";
import RenderBus from "../RenderBus";
// import SceneManager from "../SceneManager";
import Scheduler from "../Scheduler";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Debugger } from "../../interfaces/Debugger";
import type { ExceptionHandler } from "../../interfaces/ExceptionHandler";
import type { HTMLElementResizeObserver as HTMLElementResizeObserverInterface } from "../../interfaces/HTMLElementResizeObserver";
import type { KeyboardState as KeyboardStateInterface } from "../../interfaces/KeyboardState";
import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../../interfaces/LoggerBreadcrumbs";
import type { MainLoop as MainLoopInterface } from "../../interfaces/MainLoop";
import type { PointerState as PointerStateInterface } from "../../interfaces/PointerState";
import type { RenderBus as RenderBusInterface } from "../../interfaces/RenderBus";
import type { QueryBus } from "../../interfaces/QueryBus";
// import type { SceneManager as SceneManagerInterface } from "../../interfaces/SceneManager";
import type { Scheduler as SchedulerInterface } from "../../interfaces/Scheduler";

const ATTR_DOCUMENT_HIDDEN = "documenthidden";

export default class SceneCanvas extends HTMLElement {
  +canvasElement: HTMLCanvasElement;
  +keyboardState: KeyboardStateInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mainLoop: MainLoopInterface;
  +pointerState: PointerStateInterface;
  +renderBus: RenderBusInterface;
  +resizeObserver: HTMLElementResizeObserverInterface;
  +scheduler: SchedulerInterface;
  isHidden: bool;
  isLooping: bool;
  isObserving: bool;

  static get observedAttributes(): $ReadOnlyArray<string> {
    return [
      ATTR_DOCUMENT_HIDDEN
    ];
  }

  constructor() {
    super();
    autoBind(this);

    const shadowRoot = this.attachShadow({
      mode: "closed"
    });

    shadowRoot.innerHTML = `
      <canvas
        id="dm-canvas"
        style="
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        "
      />
    `;

    // flow assumes that shadow root does not contain `.getElementById`
    // method
    // $FlowFixMe
    this.canvasElement = shadowRoot.getElementById("dm-canvas");

    this.isHidden = yn(this.getAttribute(ATTR_DOCUMENT_HIDDEN), {
      default: true,
    });
    this.isLooping = false;
    this.isObserving = false;
    this.loggerBreadcrumbs = new LoggerBreadcrumbs(["SceneCanvas"]);
    this.keyboardState = new KeyboardState(this.loggerBreadcrumbs.add("KeyboardState"));
    this.mainLoop = MainLoop.getInstance();
    this.pointerState = new PointerState(this.loggerBreadcrumbs.add("PointerState"), this.canvasElement);
    this.resizeObserver = new HTMLElementResizeObserver(this.loggerBreadcrumbs.add("HTMLElementResizeObserver"), this);
    this.scheduler = new Scheduler();
    this.renderBus = new RenderBus(this.scheduler);

    // this.mainLoop.setMaxAllowedFPS(60);
    this.mainLoop.attachScheduler(this.scheduler);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case ATTR_DOCUMENT_HIDDEN:
        this.isHidden = yn(newValue, {
          default: true,
        });
        this.onComponentStateChange();
      break;
      default:
        return;
    }
  }

  connectedCallback() {
    // connectedCallback may be called once your element is no longer
    // connected, use Node.isConnected to make sure.
    // source: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
    this.onComponentStateChange();
  }

  disconnectedCallback() {
    this.onComponentStateChange();
  }

  onComponentStateChange(): void {
    const shouldObserve = this.isConnected && this.isLooping && !this.isHidden;

    if (shouldObserve && this.isObserving) {
      return;
    }

    if (!shouldObserve && !this.isObserving) {
      return;
    }

    if (shouldObserve) {
      this.keyboardState.observe();
      this.pointerState.observe();
      this.resizeObserver.observe();

      this.mainLoop.start();
      this.isObserving = true;
    } else {
      this.keyboardState.disconnect();
      this.pointerState.disconnect();
      this.resizeObserver.disconnect();

      this.mainLoop.stop();
      this.isObserving = false;
    }
  }

  async startPainting(
    cancelToken: CancelToken,
    debug: Debugger,
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbsInterface,
    queryBus: QueryBus
  ): Promise<void> {
    if (this.isLooping) {
      throw new Idempotence(loggerBreadcrumbs, "SceneCanvas@startPainting is not idempotent.");
    }

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: this.canvasElement,
      // context: canvas.getContext("webgl2"),
    });

    this.isLooping = true;
    this.onComponentStateChange();

    await cancelToken.whenCanceled();

    renderer.dispose();
    // this.resizeObserver.notify(sceneManager);
    // sceneManager.resize(new HTMLElementSize(this));

    this.isLooping = false;
    this.onComponentStateChange();
  }
}
