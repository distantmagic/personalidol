// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import yn from "yn";

import CanvasControllerBus from "../CanvasControllerBus";
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

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasControllerBus as CanvasControllerBusInterface } from "../../interfaces/CanvasControllerBus";
import type { CanvasViewBus as CanvasViewBusInterface } from "../../interfaces/CanvasViewBus";
import type { HTMLElementResizeObserver as HTMLElementResizeObserverInterface } from "../../interfaces/HTMLElementResizeObserver";
import type { KeyboardState as KeyboardStateInterface } from "../../interfaces/KeyboardState";
import type { MainLoop as MainLoopInterface } from "../../interfaces/MainLoop";
import type { PointerState as PointerStateInterface } from "../../interfaces/PointerState";
import type { Scheduler as SchedulerInterface } from "../../interfaces/Scheduler";

const ATTR_DOCUMENT_HIDDEN = "documenthidden";

export default class SceneCanvas extends HTMLElement {
  +canvasControllerBus: CanvasControllerBusInterface;
  +canvasViewBus: CanvasViewBusInterface;
  +canvasElement: HTMLCanvasElement;
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
      <style>
        canvas {
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
      </style>
      <canvas id="dm-canvas" />
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
    this.scheduler = new Scheduler();
    this.canvasControllerBus = new CanvasControllerBus(this.scheduler);
    this.canvasViewBus = new CanvasViewBus(this.scheduler);
    this.keyboardState = new KeyboardState(this.loggerBreadcrumbs.add("KeyboardState"));
    this.mainLoop = MainLoop.getInstance();
    this.pointerState = new PointerState(this.loggerBreadcrumbs.add("PointerState"), this.canvasElement);
    this.resizeObserver = new HTMLElementResizeObserver(this.loggerBreadcrumbs.add("HTMLElementResizeObserver"), this);

    this.mainLoop.setMaxAllowedFPS(4);
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

  async attachRenderer(cancelToken: CancelToken): Promise<void> {
    if (this.isLooping) {
      throw new Idempotence(
        this.loggerBreadcrumbs.add("attachRenderer"),
        "SceneCanvas@attachRenderer is not idempotent."
      );
    }

    this.isLooping = true;
    this.onComponentStateChange();

    const renderer = new THREE.WebGLRenderer({
      // alpha: true,
      canvas: this.canvasElement,
    });
    const canvasController = new RootCanvasController(
      this.canvasControllerBus,
      this.canvasViewBus,
      this.keyboardState,
      this.pointerState,
      renderer
    );

    this.resizeObserver.notify(canvasController);
    canvasController.resize(new HTMLElementSize(this));

    this.canvasControllerBus.add(canvasController);

    await canvasController.lightsUp(cancelToken);
    await cancelToken.whenCanceled();

    this.resizeObserver.off(canvasController);
    this.canvasControllerBus.delete(canvasController);
    renderer.dispose();

    this.isLooping = false;
    this.onComponentStateChange();
  }
}
