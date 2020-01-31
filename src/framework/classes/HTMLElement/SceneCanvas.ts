import * as THREE from "three";
import autoBind from "auto-bind";
import yn from "yn";

import CanvasControllerBus from "src/framework/classes/CanvasControllerBus";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import HTMLElementPositionObserver from "src/framework/classes/HTMLElementPositionObserver";
import HTMLElementSize from "src/framework/classes/HTMLElementSize";
import HTMLElementSizeObserver from "src/framework/classes/HTMLElementSizeObserver";
import Idempotence from "src/framework/classes/Exception/Idempotence";
import KeyboardState from "src/framework/classes/KeyboardState";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import MainLoop from "src/framework/classes/MainLoop";
import PointerState from "src/framework/classes/PointerState";
import SceneCanvasTemplate from "src/framework/classes/HTMLElement/SceneCanvas.template";
import Scheduler from "src/framework/classes/Scheduler";
import { default as RootCanvasController } from "src/framework/classes/CanvasController/Root";
import { default as SceneCanvasException } from "src/framework/classes/Exception/SceneCanvas";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import Debugger from "src/framework/interfaces/Debugger";
import ExceptionHandler from "src/framework/interfaces/ExceptionHandler";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoadingManager from "src/framework/interfaces/LoadingManager";
import Logger from "src/framework/interfaces/Logger";
import QueryBus from "src/framework/interfaces/QueryBus";
import { default as ICanvasControllerBus } from "src/framework/interfaces/CanvasControllerBus";
import { default as IControlToken } from "src/framework/interfaces/ControlToken";
import { default as IHTMLElementPositionObserver } from "src/framework/interfaces/HTMLElementPositionObserver";
import { default as IHTMLElementSizeObserver } from "src/framework/interfaces/HTMLElementSizeObserver";
import { default as IKeyboardState } from "src/framework/interfaces/KeyboardState";
import { default as IMainLoop } from "src/framework/interfaces/MainLoop";
import { default as IPointerState } from "src/framework/interfaces/PointerState";
import { default as IScheduler } from "src/framework/interfaces/Scheduler";

const ATTR_DOCUMENT_HIDDEN = "documenthidden";

export default class SceneCanvas extends HTMLElement implements HasLoggerBreadcrumbs {
  readonly canvasControllerBus: ICanvasControllerBus;
  readonly canvasElement: HTMLCanvasElement;
  readonly canvasWrapperElement: HTMLElement;
  readonly keyboardState: IKeyboardState;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs = new LoggerBreadcrumbs(["SceneCanvas"]);
  readonly mainLoop: IMainLoop;
  readonly mainLoopControlToken: IControlToken;
  readonly pointerState: IPointerState;
  readonly positionObserver: IHTMLElementPositionObserver;
  readonly resizeObserver: IHTMLElementSizeObserver;
  readonly scheduler: IScheduler;
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
      throw new SceneCanvasException(this.loggerBreadcrumbs, "Unable to get shadow canvas element");
    }

    this.canvasElement = canvasElement as HTMLCanvasElement;

    const canvasWrapperElement = shadowRoot.getElementById("dm-canvas-wrapper");

    if (!canvasWrapperElement) {
      throw new SceneCanvasException(this.loggerBreadcrumbs, "Unable to get shadow canvas wrapper element");
    }

    this.canvasWrapperElement = canvasWrapperElement;

    this.isHidden = yn(this.getAttribute(ATTR_DOCUMENT_HIDDEN), {
      default: true,
    });
    this.isLooping = false;
    this.isObserving = false;

    this.scheduler = new Scheduler(this.loggerBreadcrumbs.add("Scheduler"));
    this.keyboardState = new KeyboardState(this.loggerBreadcrumbs.add("KeyboardState"));
    this.mainLoop = MainLoop.getInstance(this.loggerBreadcrumbs.add("MainLoop"));
    this.mainLoopControlToken = this.mainLoop.getControllable().obtainControlToken();
    this.pointerState = new PointerState(this.loggerBreadcrumbs.add("PointerState"), this.canvasElement);
    this.positionObserver = new HTMLElementPositionObserver(this.loggerBreadcrumbs.add("HTMLElementPositionObserver"), this.canvasWrapperElement);
    this.resizeObserver = new HTMLElementSizeObserver(this.loggerBreadcrumbs.add("HTMLElementSizeObserver"), this.canvasWrapperElement);
    this.canvasControllerBus = new CanvasControllerBus(this.loggerBreadcrumbs, this.positionObserver, this.resizeObserver, this.scheduler);

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
      this.canvasControllerBus.observe();
      this.keyboardState.observe();
      this.pointerState.observe();
      this.positionObserver.observe();
      this.resizeObserver.observe();

      this.mainLoop.start(this.mainLoopControlToken);
      this.isObserving = true;
    } else {
      this.canvasControllerBus.disconnect();
      this.keyboardState.disconnect();
      this.pointerState.disconnect();
      this.positionObserver.disconnect();
      this.resizeObserver.disconnect();

      this.mainLoop.stop(this.mainLoopControlToken);
      this.isObserving = false;
    }
  }

  @cancelable()
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
      alpha: true,
      antialias: false,
      canvas: this.canvasElement,
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    renderer.setPixelRatio(window.devicePixelRatio);

    const canvasViewBus = new CanvasViewBus(breadcrumbs.add("CanvasViewBus"), this.scheduler);
    const canvasViewBag = new CanvasViewBag(breadcrumbs.add("CanvasViewBag"), canvasViewBus);

    const canvasController = new RootCanvasController(
      breadcrumbs.add("RootCanvasController"),
      this.canvasControllerBus,
      canvasViewBag.fork(breadcrumbs.add("RootCanvasControllert")),
      debug,
      this.keyboardState,
      loadingManager,
      logger,
      this.pointerState,
      queryBus,
      renderer,
      this.scheduler,
      threeLoadingManager
    );

    await loadingManager.blocking(this.canvasControllerBus.add(cancelToken, canvasController), "Loading initial game resources");

    canvasController.resize(new HTMLElementSize(this.canvasWrapperElement));
    this.canvasWrapperElement.classList.add("dm-canvas-wrapper--loaded");

    logger.debug(breadcrumbs.add("attachRenderer"), "Game is ready.");

    // setTimeout(() => {
    //   cancelToken.cancel(breadcrumbs);
    // }, 100);

    await cancelToken.whenCanceled();

    // prevent some memory leaks
    renderer.dispose();
    renderer.forceContextLoss();
    this.canvasElement.remove();

    await loadingManager.blocking(canvasViewBag.dispose(cancelToken), "Disposing root canvas controller");
    await loadingManager.blocking(this.canvasControllerBus.delete(cancelToken, canvasController), "Disposing game resources");

    this.isLooping = false;
    this.onComponentStateChange();

    await logger.debug(breadcrumbs.add("attachRenderer"), "Game is completely disposed of.");
  }
}
