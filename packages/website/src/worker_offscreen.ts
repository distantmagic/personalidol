import Loglevel from "loglevel";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { Dimensions } from "@personalidol/framework/src/Dimensions";
import { EventBus } from "@personalidol/framework/src/EventBus";
import { Input } from "@personalidol/framework/src/Input";
import { MainLoop } from "@personalidol/framework/src/MainLoop";
import { RequestAnimationFrameScheduler } from "@personalidol/framework/src/RequestAnimationFrameScheduler";
import { ServiceManager } from "@personalidol/framework/src/ServiceManager";

import { bootstrap } from "./bootstrap";
import { workers } from "./workers";

const dimensionsState = Dimensions.createEmptyState();
const eventBus = EventBus();
const inputState = Input.createEmptyState();
const logger = Loglevel.getLogger(workers.offscreen.name);

logger.setLevel(__LOG_LEVEL);

const mainLoop = MainLoop(RequestAnimationFrameScheduler());
const serviceManager = ServiceManager();

const _canvasStyle = {
  height: 0,
  width: 0,
};

let _canvas: null | OffscreenCanvas = null;
let _devicePixelRatio: null | number = null;
let _isBootstrapped = false;
let atlasMessagePort: null | MessagePort = null;
let domMessagePort: null | MessagePort = null;
let md2MessagePort: null | MessagePort = null;
let quakeMapsMessagePort: null | MessagePort = null;
let texturesMessagePort: null | MessagePort = null;

function _bootstrapSafe(): void {
  // prettier-ignore
  if (
    _canvas === null ||
    _devicePixelRatio === null ||
    atlasMessagePort === null ||
    domMessagePort === null ||
    md2MessagePort === null ||
    quakeMapsMessagePort === null ||
    texturesMessagePort === null
  ) {
    return;
  }

  if (_isBootstrapped) {
    throw new Error("Offscreen worker can be only presented with canvas once. It has to be torn down and reinitialized if you need to use another canvas.");
  }

  // prettier-ignore
  bootstrap(
    _devicePixelRatio,
    eventBus,
    mainLoop,
    serviceManager,
    _canvas,
    dimensionsState,
    inputState,
    logger,
    atlasMessagePort,
    domMessagePort,
    md2MessagePort,
    quakeMapsMessagePort,
    texturesMessagePort
  );
  _isBootstrapped = true;
}

self.onmessage = createRouter({
  atlasMessagePort(port: MessagePort): void {
    atlasMessagePort = port;
    _bootstrapSafe();
  },

  canvas(canvas: OffscreenCanvas): void {
    // hack to make it work with three.js
    (canvas as any).style = _canvasStyle;

    _canvas = canvas;
    _bootstrapSafe();
  },

  devicePixelRatio(devicePixelRatio: number): void {
    _devicePixelRatio = devicePixelRatio;
    _bootstrapSafe();
  },

  dimensions(dimensions: Uint16Array): void {
    dimensionsState.set(dimensions);
  },

  domMessagePort(port: MessagePort): void {
    domMessagePort = port;
    _bootstrapSafe();
  },

  input(input: Uint8Array): void {
    inputState.set(input);
  },

  md2MessagePort(port: MessagePort): void {
    md2MessagePort = port;
    _bootstrapSafe();
  },

  pointerZoomRequest(zoomAmount: number): void {
    eventBus.POINTER_ZOOM_REQUEST.forEach(function (callback) {
      callback(zoomAmount);
    });
  },

  quakeMapsMessagePort(port: MessagePort): void {
    quakeMapsMessagePort = port;
    _bootstrapSafe();
  },

  texturesMessagePort(port: MessagePort): void {
    texturesMessagePort = port;
    _bootstrapSafe();
  },

  start(): void {
    mainLoop.start();
    serviceManager.start();
  },

  stop(): void {
    mainLoop.stop();
    serviceManager.stop();
  },
});
