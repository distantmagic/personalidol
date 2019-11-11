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
import Scheduler from "../Scheduler";
import { default as RootCanvasController } from "../CanvasController/Root";

import type { LoadingManager as THREELoadingManager } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasControllerBus as CanvasControllerBusInterface } from "../../interfaces/CanvasControllerBus";
import type { CanvasViewBag as CanvasViewBagInterface } from "../../interfaces/CanvasViewBag";
import type { CanvasViewBus as CanvasViewBusInterface } from "../../interfaces/CanvasViewBus";
import type { Debugger } from "../../interfaces/Debugger";
import type { HTMLElementResizeObserver as HTMLElementResizeObserverInterface } from "../../interfaces/HTMLElementResizeObserver";
import type { KeyboardState as KeyboardStateInterface } from "../../interfaces/KeyboardState";
import type { LoadingManager } from "../../interfaces/LoadingManager";
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

    shadowRoot.innerHTML = `
      <div
        id="dm-canvas-wrapper"
        style="
          height: 100%;
          position: relative;
          width: 100%;
        "
      >
        <canvas id="dm-canvas" />
      </div>
    `;

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
    this.canvasViewBus = new CanvasViewBus(this.scheduler);
    this.canvasViewBag = new CanvasViewBag(this.canvasViewBus, this.loggerBreadcrumbs);
    this.keyboardState = new KeyboardState(this.loggerBreadcrumbs.add("KeyboardState"));
    this.mainLoop = MainLoop.getInstance();
    this.pointerState = new PointerState(this.loggerBreadcrumbs.add("PointerState"), this.canvasElement);
    this.resizeObserver = new HTMLElementResizeObserver(
      this.loggerBreadcrumbs.add("HTMLElementResizeObserver"),
      this.canvasWrapperElement
    );
    this.canvasControllerBus = new CanvasControllerBus(this.resizeObserver, this.scheduler);

    // this.mainLoop.setMaxAllowedFPS(10);
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
    loadingManager: LoadingManager,
    queryBus: QueryBus,
    threeLoadingManager: THREELoadingManager
  ): Promise<void> {
    if (this.isLooping) {
      throw new Idempotence(
        this.loggerBreadcrumbs.add("attachRenderer"),
        "SceneCanvas@attachRenderer is not idempotent."
      );
    }

    this.isLooping = true;
    this.onComponentStateChange();

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvasElement,
    });

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    const canvasController = new RootCanvasController(
      this.canvasControllerBus,
      this.canvasViewBag.fork(this.loggerBreadcrumbs.add("RootCanvasControllert")),
      debug,
      this.keyboardState,
      loadingManager,
      this.loggerBreadcrumbs.add("RootCanvasController"),
      this.pointerState,
      queryBus,
      renderer,
      this.scheduler,
      threeLoadingManager
    );

    await loadingManager.blocking(this.canvasControllerBus.add(canvasController), "Loading root canvas controller");

    canvasController.resize(new HTMLElementSize(this.canvasWrapperElement));

    await cancelToken.whenCanceled();

    // prevent some memory leaks
    renderer.dispose();
    renderer.forceContextLoss();
    this.canvasElement.remove();

    await loadingManager.blocking(this.canvasViewBag.dispose(), "Disposing root canvas controller");
    await loadingManager.blocking(this.canvasControllerBus.delete(canvasController), "Disposing canvas views");

    this.isLooping = false;
    this.onComponentStateChange();
  }
}
