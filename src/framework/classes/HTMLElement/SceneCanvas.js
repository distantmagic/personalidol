// @flow

import HTMLElementResizeObserver from "../HTMLElementResizeObserver";
import KeyboardState from "../KeyboardState";
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
import type { PointerState as PointerStateInterface } from "../../interfaces/PointerState";
import type { QueryBus } from "../../interfaces/QueryBus";
import type { SceneManager as SceneManagerInterface } from "../../interfaces/SceneManager";

export default class SceneCanvas extends HTMLElement {
  canvasElement: HTMLCanvasElement;
  keyboardState: KeyboardStateInterface;
  pointerState: PointerStateInterface;
  resizeObserver: HTMLElementResizeObserverInterface;
  sceneManager: ?SceneManagerInterface;

  // static get observedAttributes() {
  //   return ['foo'];
  // }

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

    // $FlowFixMe
    this.canvasElement = shadowRoot.getElementById("dm-canvas");
    this.keyboardState = new KeyboardState();
    this.pointerState = new PointerState(this.canvasElement);
    this.resizeObserver = new HTMLElementResizeObserver(this.canvasElement);

    // resizeObserver.notify(sceneManager);
    // sceneManager.resize(new HTMLElementSize(scene));
  }

  // attributeChangedCallback(name, oldValue, newValue) {
  //   console.log('attributeChangedCallback', name, oldValue, newValue);
  // }

  connectedCallback() {
    // connectedCallback may be called once your element is no longer
    // connected, use Node.isConnected to make sure.
    // source: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
    if (!this.isConnected) {
      return;
    }

    console.log("connectedCallback", this.isConnected, this.canvasElement);
    this.keyboardState.observe();
    this.pointerState.observe();
    this.resizeObserver.observe();
  }

  disconnectedCallback() {
    console.log('disconnectedCallback');
    this.keyboardState.disconnect();
    this.pointerState.disconnect();
    this.resizeObserver.disconnect();
  }

  async attach(
    cancelToken: CancelToken,
    debug: Debugger,
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus
  ): Promise<void> {
    const threeLoadingManager = new THREELoadingManager(loggerBreadcrumbs.add("THREELoadingManager"), exceptionHandler);

    this.dispatchEvent(new CustomEvent('foo', { 'bar': 'baz' }));
    this.sceneManager = new SceneManager(
      loggerBreadcrumbs.add("SceneManager"),
      exceptionHandler,
      new Scheduler(),
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
  }

  async detach(): Promise<void> {}
}

// const threeLoadingManager = props.game.getTHREELoadingManager();

// const [resourcesLoadingState, setResourcesLoadingState] = React.useState<ResourcesLoadingState>(
//   threeLoadingManager.getResourcesLoadingState()
// );
