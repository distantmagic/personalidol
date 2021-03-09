/// <reference lib="webworker" />

import Loglevel from "loglevel";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { EventBus } from "@personalidol/framework/src/EventBus";
import { MainLoop } from "@personalidol/framework/src/MainLoop";
import { MainLoopStatsHook } from "@personalidol/framework/src/MainLoopStatsHook";
import { RequestAnimationFrameScheduler } from "@personalidol/framework/src/RequestAnimationFrameScheduler";
import { ServiceManager } from "@personalidol/framework/src/ServiceManager";
import { ServiceBuilder } from "@personalidol/framework/src/ServiceBuilder";
import { StatsReporter } from "@personalidol/framework/src/StatsReporter";
import { UserSettings } from "@personalidol/personalidol/src/UserSettings";

import { createScenes } from "./createScenes";

import type { MainLoop as IMainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { MessageWorkerReady } from "@personalidol/framework/src/MessageWorkerReady.type";
import type { ServiceBuilder as IServiceBuilder } from "@personalidol/framework/src/ServiceBuilder.interface";
import type { ServiceManager as IServiceManager } from "@personalidol/framework/src/ServiceManager.interface";

type Dependencies = {
  canvas: OffscreenCanvas;
  devicePixelRatio: number;
  dimensionsState: Uint32Array;
  domMessagePort: MessagePort;
  fontPreloadMessagePort: MessagePort;
  gltfMessagePort: MessagePort;
  internationalizationMessagePort: MessagePort;
  keyboardState: Uint8Array;
  md2MessagePort: MessagePort;
  pointerState: Int32Array;
  progressMessagePort: MessagePort;
  quakeMapsMessagePort: MessagePort;
  statsMessagePort: MessagePort;
  texturesMessagePort: MessagePort;
  uiMessagePort: MessagePort;
  userSettingsMessagePort: MessagePort;
};

declare var self: DedicatedWorkerGlobalScope;

const partialDependencies: Partial<Dependencies> = {
  canvas: undefined,
  devicePixelRatio: undefined,
  dimensionsState: undefined,
  domMessagePort: undefined,
  fontPreloadMessagePort: undefined,
  gltfMessagePort: undefined,
  internationalizationMessagePort: undefined,
  keyboardState: undefined,
  md2MessagePort: undefined,
  pointerState: undefined,
  progressMessagePort: undefined,
  quakeMapsMessagePort: undefined,
  statsMessagePort: undefined,
  texturesMessagePort: undefined,
  uiMessagePort: undefined,
  userSettingsMessagePort: undefined,
};
const eventBus = EventBus();
const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const _canvasStyle = Object.seal({
  height: 0,
  width: 0,
});

const mainLoop: IMainLoop = MainLoop(logger, RequestAnimationFrameScheduler());
const serviceManager: IServiceManager = ServiceManager(logger);

const serviceBuilder: IServiceBuilder<Dependencies> = ServiceBuilder<Dependencies>(self.name, partialDependencies);

serviceBuilder.onready.add(onDependenciesReady);

function notifyReady(): void {
  self.postMessage(<MessageWorkerReady>{
    ready: true,
  });
}

function onDependenciesReady(dependencies: Dependencies): void {
  const userSettings = UserSettings.createEmptyState(dependencies.devicePixelRatio);
  const statsReporter = StatsReporter(self.name, userSettings, dependencies.statsMessagePort, mainLoop.tickTimerState);

  statsReporter.hooks.add(MainLoopStatsHook(mainLoop));

  mainLoop.updatables.add(statsReporter);
  serviceManager.services.add(statsReporter);

  // prettier-ignore
  createScenes(
    self.name,
    dependencies.devicePixelRatio,
    eventBus,
    mainLoop,
    serviceManager,
    dependencies.canvas,
    dependencies.dimensionsState,
    dependencies.keyboardState,
    dependencies.pointerState,
    logger,
    statsReporter,
    userSettings,
    dependencies.domMessagePort,
    dependencies.fontPreloadMessagePort,
    dependencies.gltfMessagePort,
    dependencies.internationalizationMessagePort,
    dependencies.md2MessagePort,
    dependencies.progressMessagePort,
    dependencies.quakeMapsMessagePort,
    dependencies.statsMessagePort,
    dependencies.texturesMessagePort,
    dependencies.uiMessagePort,
    dependencies.userSettingsMessagePort,
  );
}

self.onmessage = createRouter({
  canvas(canvas: OffscreenCanvas): void {
    // hack to make it work with three.js
    (canvas as any).style = _canvasStyle;

    serviceBuilder.setDependency("canvas", canvas);
  },

  devicePixelRatio(devicePixelRatio: number): void {
    serviceBuilder.setDependency("devicePixelRatio", devicePixelRatio);
  },

  dimensionsState(newDimensionsState: Uint32Array): void {
    const dimensionsState: undefined | Uint32Array = partialDependencies.dimensionsState;

    if (dimensionsState) {
      dimensionsState.set(newDimensionsState);
    } else {
      serviceBuilder.setDependency("dimensionsState", newDimensionsState);
    }
  },

  domMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("domMessagePort", port);
  },

  fontPreloadMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("fontPreloadMessagePort", port);
  },

  gltfMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("gltfMessagePort", port);
  },

  internationalizationMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("internationalizationMessagePort", port);
  },

  keyboardState(newKeyboardState: Uint8Array): void {
    const keyboardState: undefined | Uint8Array = partialDependencies.keyboardState;

    if (keyboardState) {
      keyboardState.set(newKeyboardState);
    } else {
      serviceBuilder.setDependency("keyboardState", newKeyboardState);
    }
  },

  md2MessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("md2MessagePort", port);
  },

  pointerState(newPointerState: Int32Array): void {
    const pointerState: undefined | Int32Array = partialDependencies.pointerState;

    if (pointerState) {
      pointerState.set(newPointerState);
    } else {
      serviceBuilder.setDependency("pointerState", newPointerState);
    }
  },

  pointerZoomRequest(zoomAmount: number): void {
    eventBus.POINTER_ZOOM_REQUEST.forEach(function (callback) {
      callback(zoomAmount);
    });
  },

  progressMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("progressMessagePort", port);
  },

  quakeMapsMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("quakeMapsMessagePort", port);
  },

  sharedDimensionsState(dimensions: SharedArrayBuffer): void {
    serviceBuilder.setDependency("dimensionsState", new Uint32Array(dimensions));
  },

  sharedKeyboardState(keyboard: SharedArrayBuffer): void {
    serviceBuilder.setDependency("keyboardState", new Uint8Array(keyboard));
  },

  sharedPointerState(input: SharedArrayBuffer): void {
    serviceBuilder.setDependency("pointerState", new Int32Array(input));
  },

  statsMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("statsMessagePort", port);
  },

  texturesMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("texturesMessagePort", port);
  },

  uiMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("uiMessagePort", port);
  },

  userSettingsMessagePort(port: MessagePort): void {
    serviceBuilder.setDependency("userSettingsMessagePort", port);
  },

  // WorkerService

  ready(): void {
    if (serviceBuilder.isReady()) {
      notifyReady();
    } else {
      serviceBuilder.onready.add(notifyReady);
    }
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
