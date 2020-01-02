// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import yn from "yn";

import CanvasControllerBus from "../CanvasControllerBus";
import CanvasViewBag from "../CanvasViewBag";
import CanvasViewBus from "../CanvasViewBus";
import HTMLElementResizeObserver from "../HTMLElementResizeObserver";
import HTMLElementSize from "../HTMLElementSize";
import Idempotence from "../Exception/Idempotence";
import KeyboardState from "../KeyboardState";
import LoggerBreadcrumbs from "../LoggerBreadcrumbs";
import MainLoop from "../MainLoop";
import PointerState from "../PointerState";
import SceneCanvasTemplate from "./SceneCanvas.template";
import Scheduler from "../Scheduler";
import { default as RootCanvasController } from "../CanvasController/Root";

import type { LoadingManager as THREELoadingManager } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasControllerBus as CanvasControllerBusInterface } from "../../interfaces/CanvasControllerBus";
import type { CanvasViewBag as CanvasViewBagInterface } from "../../interfaces/CanvasViewBag";
import type { CanvasViewBus as CanvasViewBusInterface } from "../../interfaces/CanvasViewBus";
import type { Debugger } from "../../interfaces/Debugger";
import type { ExceptionHandler } from "../../interfaces/ExceptionHandler";
import type { HTMLElementResizeObserver as HTMLElementResizeObserverInterface } from "../../interfaces/HTMLElementResizeObserver";
import type { KeyboardState as KeyboardStateInterface } from "../../interfaces/KeyboardState";
import type { LoadingManager } from "../../interfaces/LoadingManager";
import type { Logger } from "../../interfaces/Logger";
import type { MainLoop as MainLoopInterface } from "../../interfaces/MainLoop";
import type { PointerState as PointerStateInterface } from "../../interfaces/PointerState";
import type { QueryBus } from "../../interfaces/QueryBus";
import type { Scheduler as SchedulerInterface } from "../../interfaces/Scheduler";

const ATTR_DOCUMENT_HIDDEN = "documenthidden";

export default class SceneCanvas extends HTMLElement {
  +canvasControllerBus: CanvasControllerBusInterface;
  +canvasElement: HTMLCanvasElement;
  +canvasViewBag: CanvasViewBagInterface;
  +canvasViewBus: CanvasViewBusInterface;
  +canvasWrapperElement: HTMLDivElement;
  +keyboardState: KeyboardStateInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mainLoop: MainLoopInterface;
  +pointerState: PointerStateInterface;
  +resizeObserver: HTMLElementResizeObserverInterface;
  +scheduler: SchedulerInterface;
  isHidden: boolean;
  isLooping: boolean;
  isObserving: boolean;

  static get observedAttributes(): $ReadOnlyArray<string> {
    return [ATTR_DOCUMENT_HIDDEN];
  }

  constructor() {
    super();
    autoBind(this);

    const shadowRoot = this.attachShadow({
      mode: "closed",
    });

    shadowRoot.innerHTML = SceneCanvasTemplate();

    // flow assumes that shadow root does not contain `.getElementById`
    // method
    // $FlowFixMe
    this.canvasElement = shadowRoot.getElementById("dm-canvas");
    // $FlowFixMe
    this.canvasWrapperElement = shadowRoot.getElementById("dm-canvas-wrapper");

    this.isHidden = yn(this.getAttribute(ATTR_DOCUMENT_HIDDEN), {
      default: true,
    });
    this.isLooping = false;
    this.isObserving = false;

    this.loggerBreadcrumbs = new LoggerBreadcrumbs(["SceneCanvas"]);
    this.scheduler = new Scheduler();
    this.canvasViewBus = new CanvasViewBus(this.loggerBreadcrumbs, this.scheduler);
    this.canvasViewBag = new CanvasViewBag(this.canvasViewBus, this.loggerBreadcrumbs);
    this.keyboardState = new KeyboardState(this.loggerBreadcrumbs.add("KeyboardState"));
    this.mainLoop = MainLoop.getInstance();
    this.pointerState = new PointerState(this.loggerBreadcrumbs.add("PointerState"), this.canvasElement);
    this.resizeObserver = new HTMLElementResizeObserver(this.loggerBreadcrumbs.add("HTMLElementResizeObserver"), this.canvasWrapperElement);
    this.canvasControllerBus = new CanvasControllerBus(this.loggerBreadcrumbs, this.resizeObserver, this.scheduler);

    this.mainLoop.setMaxAllowedFPS(80);
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

  async attachRenderer(
    cancelToken: CancelToken,
    debug: Debugger,
    exceptionHandler: ExceptionHandler,
    loadingManager: LoadingManager,
    logger: Logger,
    queryBus: QueryBus,
    threeLoadingManager: THREELoadingManager
  ): Promise<void> {
    const breadcrumbs = this.loggerBreadcrumbs.add("attachRenderer");

    if (this.isLooping) {
      throw new Idempotence(breadcrumbs, "SceneCanvas@attachRenderer is not idempotent.");
    }

    this.isLooping = true;
    this.onComponentStateChange();

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      canvas: this.canvasElement,
      // context: this.canvasElement.getContext(WEBGL.isWebGL2Available() ? "webgl2" : "webgl", {
      //   alpha: false,
      // }),
      // powerPreference: "high-performance",
      // physicallyCorrectLights: true,
      // precision: "lowp",
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    renderer.setPixelRatio(window.devicePixelRatio);

    const canvasController = new RootCanvasController(
      this.canvasControllerBus,
      this.canvasViewBag.fork(this.loggerBreadcrumbs.add("RootCanvasControllert")),
      debug,
      this.keyboardState,
      loadingManager,
      logger,
      this.loggerBreadcrumbs.add("RootCanvasController"),
      this.pointerState,
      queryBus,
      renderer,
      this.scheduler,
      threeLoadingManager
    );

    await loadingManager.blocking(this.canvasControllerBus.add(cancelToken, canvasController), "Loading initial game resources");

    canvasController.resize(new HTMLElementSize(this.canvasWrapperElement));
    this.canvasWrapperElement.classList.add("dm-canvas-wrapper--loaded");

    logger.debug(this.loggerBreadcrumbs.add("attachRenderer"), "Game is ready.");

    // setTimeout(() => {
    //   cancelToken.cancel(this.loggerBreadcrumbs);
    // }, 100);

    await cancelToken.whenCanceled();

    // prevent some memory leaks
    renderer.dispose();
    renderer.forceContextLoss();
    this.canvasElement.remove();

    await loadingManager.blocking(this.canvasViewBag.dispose(cancelToken), "Disposing root canvas controller");
    await loadingManager.blocking(this.canvasControllerBus.delete(cancelToken, canvasController), "Disposing game resources");

    this.isLooping = false;
    this.onComponentStateChange();

    await logger.debug(this.loggerBreadcrumbs.add("attachRenderer"), "Game is completely disposed of.");
  }
}
