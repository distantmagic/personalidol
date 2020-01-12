import * as THREE from "three";
import autoBind from "auto-bind";
import yn from "yn";

import CanvasControllerBus from "src/framework/classes/CanvasControllerBus";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import HTMLElementResizeObserver from "src/framework/classes/HTMLElementResizeObserver";
import HTMLElementSize from "src/framework/classes/HTMLElementSize";
import Idempotence from "src/framework/classes/Exception/Idempotence";
import KeyboardState from "src/framework/classes/KeyboardState";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import MainLoop from "src/framework/classes/MainLoop";
import PointerState from "src/framework/classes/PointerState";
import SceneCanvasTemplate from "src/framework/classes/HTMLElement/SceneCanvas.template";
import Scheduler from "src/framework/classes/Scheduler";
import { default as RootCanvasController } from "src/framework/classes/CanvasController/Root";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasControllerBus as CanvasControllerBusInterface } from "src/framework/interfaces/CanvasControllerBus";
import { CanvasViewBag as CanvasViewBagInterface } from "src/framework/interfaces/CanvasViewBag";
import { CanvasViewBus as CanvasViewBusInterface } from "src/framework/interfaces/CanvasViewBus";
import { Debugger } from "src/framework/interfaces/Debugger";
import { ExceptionHandler } from "src/framework/interfaces/ExceptionHandler";
import { HTMLElementResizeObserver as HTMLElementResizeObserverInterface } from "src/framework/interfaces/HTMLElementResizeObserver";
import { KeyboardState as KeyboardStateInterface } from "src/framework/interfaces/KeyboardState";
import { LoadingManager } from "src/framework/interfaces/LoadingManager";
import { Logger } from "src/framework/interfaces/Logger";
import { MainLoop as MainLoopInterface } from "src/framework/interfaces/MainLoop";
import { PointerState as PointerStateInterface } from "src/framework/interfaces/PointerState";
import { QueryBus } from "src/framework/interfaces/QueryBus";
import { Scheduler as SchedulerInterface } from "src/framework/interfaces/Scheduler";

const ATTR_DOCUMENT_HIDDEN = "documenthidden";

export default class SceneCanvas extends HTMLElement {
  readonly canvasControllerBus: CanvasControllerBusInterface;
  readonly canvasElement: HTMLCanvasElement;
  readonly canvasViewBag: CanvasViewBagInterface;
  readonly canvasViewBus: CanvasViewBusInterface;
  readonly canvasWrapperElement: HTMLElement;
  readonly keyboardState: KeyboardStateInterface;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly mainLoop: MainLoopInterface;
  readonly pointerState: PointerStateInterface;
  readonly resizeObserver: HTMLElementResizeObserverInterface;
  readonly scheduler: SchedulerInterface;
  private isHidden: boolean;
  private isLooping: boolean;
  private isObserving: boolean;

  static get observedAttributes(): ReadonlyArray<string> {
    return [ATTR_DOCUMENT_HIDDEN];
  }

  constructor() {
    super();
    autoBind(this);

    const shadowRoot = this.attachShadow({
      mode: "closed",
    });

    shadowRoot.innerHTML = SceneCanvasTemplate();

    const canvasElement = shadowRoot.getElementById("dm-canvas");

    if (!canvasElement) {
      throw new Error("Unable to get shadow canvas element");
    }

    this.canvasElement = canvasElement as HTMLCanvasElement;

    const canvasWrapperElement = shadowRoot.getElementById("dm-canvas-wrapper");

    if (!canvasWrapperElement) {
      throw new Error("Unable to get shadow canvas wrapper element");
    }

    this.canvasWrapperElement = canvasWrapperElement;

    this.isHidden = yn(this.getAttribute(ATTR_DOCUMENT_HIDDEN), {
      default: true,
    });
    this.isLooping = false;
    this.isObserving = false;

    this.loggerBreadcrumbs = new LoggerBreadcrumbs(["SceneCanvas"]);
    this.scheduler = new Scheduler(this.loggerBreadcrumbs.add("Scheduler"));
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
    threeLoadingManager: THREE.LoadingManager
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
