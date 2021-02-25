/// <reference lib="webworker" />

import Loglevel from "loglevel";

import { AtlasService } from "@personalidol/texture-loader/src/AtlasService";
import { createRouter } from "@personalidol/framework/src/createRouter";

import type { AtlasService as IAtlasService } from "@personalidol/texture-loader/src/AtlasService.interface";
import type { MessageWorkerReady } from "@personalidol/framework/src/MessageWorkerReady.type";

declare var self: DedicatedWorkerGlobalScope;

let _atlasService: null | IAtlasService = null;
let _canvas: null | OffscreenCanvas = null;
let _context2d: null | OffscreenCanvasRenderingContext2D = null;
let _isBootstrapped: boolean = false;
let _notifiedReady: boolean = false;
let _progressMessagePort: null | MessagePort = null;
let _shouldNotifyReady: boolean = false;
let _statsMessagePort: null | MessagePort = null;
let _texturesMessagePort: null | MessagePort = null;

const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

function _safeStartService() {
  if (null === _canvas || null === _context2d || null === _progressMessagePort || null === _statsMessagePort || null === _texturesMessagePort) {
    return;
  }

  if (_isBootstrapped) {
    throw new Error(`WORKER(${self.name}) can be only bootstrapped once. It has to be torn down and reinitialized.`);
  }

  _atlasService = AtlasService(_canvas, _context2d, _progressMessagePort, _texturesMessagePort);
  _isBootstrapped = true;

  if (_shouldNotifyReady) {
    _notifyReady();
  }
}

function _notifyReady(): void {
  if (_notifiedReady) {
    throw new Error("WORKER(${self.name}) already notified its ready state.");
  }

  _notifiedReady = true;

  self.postMessage(<MessageWorkerReady>{
    ready: true,
  });
}

self.onmessage = createRouter({
  // Dependencies

  atlasCanvas(canvas: OffscreenCanvas) {
    if (null !== _canvas) {
      throw new Error(`Offscreen canvas was already received by WORKER(${self.name}).`);
    }

    const context2d = canvas.getContext("2d");

    if (!context2d) {
      throw new Error(`Unable to obtain 2D context from the offscreen atlas canvas within WORKER(${self.name}).`);
    }

    _canvas = canvas;
    _context2d = context2d;
    _safeStartService();
  },

  atlasMessagePort(port: MessagePort) {
    if (null === _atlasService) {
      throw new Error(`Atlas service is not yet initialized in WORKER(${self.name}).`);
    }

    _atlasService.registerMessagePort(port);
  },

  progressMessagePort(port: MessagePort): void {
    if (null !== _progressMessagePort) {
      throw new Error(`Progress message port was already received by WORKER(${self.name}).`);
    }

    _progressMessagePort = port;
    _safeStartService();
  },

  statsMessagePort(port: MessagePort): void {
    if (null !== _statsMessagePort) {
      throw new Error(`Stats message port was already received by WORKER(${self.name}).`);
    }

    _statsMessagePort = port;
    _safeStartService();
  },

  texturesMessagePort(messagePort: MessagePort) {
    if (null !== _texturesMessagePort) {
      throw new Error(`Textures message port was already received by WORKER(${self.name}).`);
    }

    _texturesMessagePort = messagePort;
    _safeStartService();
  },

  // WorkerService

  ready(): void {
    if (_isBootstrapped) {
      _notifyReady();
    } else {
      _shouldNotifyReady = true;
    }
  },

  start(): void {
    if (null === _atlasService) {
      throw new Error("AtlasService is not ready.");
    }

    _atlasService.start();
  },

  stop(): void {
    if (null === _atlasService) {
      throw new Error("AtlasService is not ready.");
    }

    _atlasService.stop();
  },
});
