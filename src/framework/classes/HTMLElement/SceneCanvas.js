// @flow

import HTMLElementResizeObserver from "../HTMLElementResizeObserver";
import HTMLElementSize from "../HTMLElementSize";
import KeyboardState from "../KeyboardState";
import MainLoop from "../MainLoop";
import MainView from "../../../app/classes/MainView";
import PointerState from "../PointerState";
import SceneManager from "../SceneManager";
import Scheduler from "../Scheduler";
import THREELoadingManager from "../THREELoadingManager";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Debugger } from "../../interfaces/Debugger";
import type { ExceptionHandler } from "../../interfaces/ExceptionHandler";
import type { HTMLElementResizeObserver as HTMLElementResizeObserverInterface } from "../../interfaces/HTMLElementResizeObserver";
import type { KeyboardState as KeyboardStateInterface } from "../../interfaces/KeyboardState";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { MainLoop as MainLoopInterface } from "../../interfaces/MainLoop";
import type { PointerState as PointerStateInterface } from "../../interfaces/PointerState";
import type { QueryBus } from "../../interfaces/QueryBus";
import type { SceneManager as SceneManagerInterface } from "../../interfaces/SceneManager";
import type { Scheduler as SchedulerInterface } from "../../interfaces/Scheduler";

export default class SceneCanvas extends HTMLElement {
  canvasElement: HTMLCanvasElement;
  keyboardState: KeyboardStateInterface;
  mainLoop: MainLoopInterface;
  pointerState: PointerStateInterface;
  resizeObserver: HTMLElementResizeObserverInterface;
  sceneManager: ?SceneManagerInterface;
  scheduler: SchedulerInterface;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({
      mode: "closed"
    });

    shadowRoot.innerHTML = `
      <style>
        canvas {
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
      </style>
      <canvas id="dm-canvas"></canvas>
    `;

    // flow assumes that shadow root does not contain `.getElementById`
    // method

    // $FlowFixMe
    this.canvasElement = shadowRoot.getElementById("dm-canvas");

    this.keyboardState = new KeyboardState();
    this.mainLoop = MainLoop.getInstance();
    this.pointerState = new PointerState(this.canvasElement);
    this.resizeObserver = new HTMLElementResizeObserver(this);
    this.scheduler = new Scheduler();

    // this.mainLoop.setMaxAllowedFPS(60);
    this.mainLoop.attachScheduler(this.scheduler);
  }

  connectedCallback() {
    // connectedCallback may be called once your element is no longer
    // connected, use Node.isConnected to make sure.
    // source: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
    if (!this.isConnected) {
      return;
    }

    this.keyboardState.observe();
    this.pointerState.observe();
    this.resizeObserver.observe();

    this.mainLoop.start();
  }

  disconnectedCallback() {
    this.keyboardState.disconnect();
    this.pointerState.disconnect();
    this.resizeObserver.disconnect();

    this.mainLoop.stop();
  }

  async attach(
    cancelToken: CancelToken,
    debug: Debugger,
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus
  ): Promise<void> {
    const threeLoadingManager = new THREELoadingManager(loggerBreadcrumbs.add("THREELoadingManager"), exceptionHandler);

    threeLoadingManager.onResourcesLoadingStateChange(resourcesLoadingState => {
      this.dispatchEvent(new CustomEvent('resourcesLoadingStateChange', {
        detail: {
          resourcesLoadingState: resourcesLoadingState
        }
      }));
    });

    const sceneManager = new SceneManager(
      loggerBreadcrumbs.add("SceneManager"),
      exceptionHandler,
      this.scheduler,
      new MainView(
        exceptionHandler,
        loggerBreadcrumbs,
        threeLoadingManager,
        this.keyboardState,
        this.pointerState,
        queryBus,
        debug
      )
    );

    await sceneManager.attach(cancelToken, this.canvasElement);
    await sceneManager.start();

    this.resizeObserver.notify(sceneManager);
    sceneManager.resize(new HTMLElementSize(this));

    this.sceneManager = sceneManager;
  }

  async detach(): Promise<void> {}
}
