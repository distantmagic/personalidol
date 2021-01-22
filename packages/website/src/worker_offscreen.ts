/// <reference lib="webworker" />

import Loglevel from "loglevel";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { Dimensions } from "@personalidol/framework/src/Dimensions";
import { EventBus } from "@personalidol/framework/src/EventBus";
import { Input } from "@personalidol/framework/src/Input";
import { MainLoop } from "@personalidol/framework/src/MainLoop";
import { RequestAnimationFrameScheduler } from "@personalidol/framework/src/RequestAnimationFrameScheduler";
import { ServiceManager } from "@personalidol/framework/src/ServiceManager";

import { createScenes } from "./createScenes";

import type { MessageWorkerReady } from "@personalidol/workers/src/MessageWorkerReady.type";

declare var self: DedicatedWorkerGlobalScope;

const eventBus = EventBus();
const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const mainLoop = MainLoop(RequestAnimationFrameScheduler());
const serviceManager = ServiceManager(logger);

const _canvasStyle = {
  height: 0,
  width: 0,
};

let _canvas: null | OffscreenCanvas = null;
let _devicePixelRatio: null | number = null;
let _dimensionsState: null | Uint32Array = null;
let _inputState: null | Int32Array = null;
let _isBootstrapped = false;
let domMessagePort: null | MessagePort = null;
let fontPreloadMessagePort: null | MessagePort = null;
let md2MessagePort: null | MessagePort = null;
let progressMessagePort: null | MessagePort = null;
let quakeMapsMessagePort: null | MessagePort = null;
let texturesMessagePort: null | MessagePort = null;
let uiMessagePort: null | MessagePort = null;

function _createScenesSafe(): void {
  // prettier-ignore
  if (
    _canvas === null ||
    _devicePixelRatio === null ||
    _dimensionsState === null ||
    _inputState === null ||
    domMessagePort === null ||
    fontPreloadMessagePort === null ||
    md2MessagePort === null ||
    progressMessagePort === null ||
    quakeMapsMessagePort === null ||
    texturesMessagePort === null ||
    uiMessagePort === null
  ) {
    return;
  }

  if (_isBootstrapped) {
    throw new Error(`WORKER(${self.name}) can be only presented with canvas once. It has to be torn down and reinitialized if you need to use another canvas.`);
  }

  // prettier-ignore
  createScenes(
    _devicePixelRatio,
    eventBus,
    mainLoop,
    serviceManager,
    _canvas,
    _dimensionsState,
    _inputState,
    logger,
    domMessagePort,
    fontPreloadMessagePort,
    md2MessagePort,
    progressMessagePort,
    quakeMapsMessagePort,
    texturesMessagePort,
    uiMessagePort,
  );

  _isBootstrapped = true;
}

self.onmessage = createRouter({
  awaitSharedDimensions(awaitSharedDimensions: boolean): void {
    if (awaitSharedDimensions) {
      return;
    }

    _dimensionsState = Dimensions.createEmptyState(false);
    _inputState = Input.createEmptyState(false);
    _createScenesSafe();
  },

  canvas(canvas: OffscreenCanvas): void {
    // hack to make it work with three.js
    (canvas as any).style = _canvasStyle;

    _canvas = canvas;
    _createScenesSafe();
  },

  devicePixelRatio(devicePixelRatio: number): void {
    _devicePixelRatio = devicePixelRatio;
    _createScenesSafe();
  },

  dimensionsState(dimensions: Uint32Array): void {
    if (!_dimensionsState) {
      throw new Error("Dimensions state must be set before it's updated.");
    }

    _dimensionsState.set(dimensions);
  },

  domMessagePort(port: MessagePort): void {
    domMessagePort = port;
    _createScenesSafe();
  },

  fontPreloadMessagePort(port: MessagePort): void {
    fontPreloadMessagePort = port;
    _createScenesSafe();
  },

  inputState(input: Int32Array): void {
    if (!_inputState) {
      throw new Error("Input state must be set before it's updated.");
    }

    _inputState.set(input);
  },

  md2MessagePort(port: MessagePort): void {
    md2MessagePort = port;
    _createScenesSafe();
  },

  pointerZoomRequest(zoomAmount: number): void {
    eventBus.POINTER_ZOOM_REQUEST.forEach(function (callback) {
      callback(zoomAmount);
    });
  },

  progressMessagePort(port: MessagePort): void {
    progressMessagePort = port;
    _createScenesSafe();
  },

  quakeMapsMessagePort(port: MessagePort): void {
    quakeMapsMessagePort = port;
    _createScenesSafe();
  },

  ready(): void {
    self.postMessage(<MessageWorkerReady>{
      ready: true,
    });
  },

  sharedDimensionsState(dimensions: SharedArrayBuffer): void {
    _dimensionsState = new Uint32Array(dimensions);
  },

  sharedInputState(input: SharedArrayBuffer): void {
    _inputState = new Int32Array(input);
  },

  start(): void {
    mainLoop.start();
    serviceManager.start();
  },

  stop(): void {
    mainLoop.stop();
    serviceManager.stop();
  },

  texturesMessagePort(port: MessagePort): void {
    texturesMessagePort = port;
    _createScenesSafe();
  },

  uiMessagePort(port: MessagePort): void {
    uiMessagePort = port;
    _createScenesSafe();
  },
});
