import Loglevel from "loglevel";

import { AtlasService } from "@personalidol/texture-loader/src/AtlasService";
import { createMultiThreadMessageChannel } from "@personalidol/framework/src/createMultiThreadMessageChannel";
import { createSingleThreadMessageChannel } from "@personalidol/framework/src/createSingleThreadMessageChannel";
import { createSupportCache } from "@personalidol/support/src/createSupportCache";
import { Dimensions } from "@personalidol/framework/src/Dimensions";
import { DimensionsIndices } from "@personalidol/framework/src/DimensionsIndices.enum";
import { domElementsLookup } from "@personalidol/personalidol/src/domElementsLookup";
import { DOMTextureService } from "@personalidol/texture-loader/src/DOMTextureService";
import { DOMUIController } from "@personalidol/dom-renderer/src/DOMUIController";
import { EventBus } from "@personalidol/framework/src/EventBus";
import { FontPreloadService } from "@personalidol/dom-renderer/src/FontPreloadService";
import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { HTMLElementResizeObserver } from "@personalidol/framework/src/HTMLElementResizeObserver";
import { Input } from "@personalidol/framework/src/Input";
import { InputIndices } from "@personalidol/framework/src/InputIndices.enum";
import { InputStatsHook } from "@personalidol/framework/src/InputStatsHook";
import { isCanvasTransferControlToOffscreenSupported } from "@personalidol/support/src/isCanvasTransferControlToOffscreenSupported";
import { isCreateImageBitmapSupported } from "@personalidol/support/src/isCreateImageBitmapSupported";
import { isSharedArrayBufferSupported } from "@personalidol/support/src/isSharedArrayBufferSupported";
import { isUserSettingsValid } from "@personalidol/personalidol/src/isUserSettingsValid";
import { KeyboardObserver } from "@personalidol/framework/src/KeyboardObserver";
import { LocalStorageUserSettingsSync } from "@personalidol/framework/src/LocalStorageUserSettingsSync";
import { MainLoop } from "@personalidol/framework/src/MainLoop";
import { MainLoopStatsHook } from "@personalidol/framework/src/MainLoopStatsHook";
import { MouseObserver } from "@personalidol/framework/src/MouseObserver";
import { MouseWheelObserver } from "@personalidol/framework/src/MouseWheelObserver";
import { MultiThreadUserSettingsSync } from "@personalidol/framework/src/MultiThreadUserSettingsSync";
import { PerformanceStatsHook } from "@personalidol/framework/src/PerformanceStatsHook";
import { RequestAnimationFrameScheduler } from "@personalidol/framework/src/RequestAnimationFrameScheduler";
import { ServiceManager } from "@personalidol/framework/src/ServiceManager";
import { ServiceWorkerManager } from "@personalidol/service-worker/src/ServiceWorkerManager";
import { StatsCollector } from "@personalidol/dom-renderer/src/StatsCollector";
import { StatsCollectorUserSettingsManager } from "@personalidol/dom-renderer/src/StatsCollectorUserSettingsManager";
import { StatsReporter } from "@personalidol/framework/src/StatsReporter";
import { TouchObserver } from "@personalidol/framework/src/TouchObserver";
import { UserSettings } from "@personalidol/personalidol/src/UserSettings";
import { WorkerService } from "@personalidol/framework/src/WorkerService";

import workers from "./workers.json";

const THREAD_DEBUG_NAME: string = "main_thread";
const canvas = getHTMLElementById(window.document, "canvas");

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Canvas is not an instance of HTMLCanvasElement");
}

const devicePixelRatio = window.devicePixelRatio;
const logger = Loglevel.getLogger(THREAD_DEBUG_NAME);
const supportCache = createSupportCache();

logger.setLevel(__LOG_LEVEL);

const canvasRoot = getHTMLElementById(window.document, "canvas-root");
const uiRoot = getHTMLElementById(window.document, "ui-root");

// The entire bootstrap code is wrapped to allow 'await'. Global await is not
// widely supported yet.
// Depending on browser feature support, some workers will be started or not.
// Checking for features is asynchronous.
(async function () {
  logger.info(`BUILD_ID("${__BUILD_ID}")`);

  // Services that need to stay in the main browser thread, because they need
  // access to the DOM API.

  const useSharedBuffers = await isSharedArrayBufferSupported(supportCache);
  const dimensionsState = Dimensions.createEmptyState(useSharedBuffers);
  const inputState = Input.createEmptyState(useSharedBuffers);
  const inputStatsHook = InputStatsHook(inputState);

  const eventBus = EventBus();
  const statsReporterMessageChannel = createSingleThreadMessageChannel();

  const mainLoopStatsHook = MainLoopStatsHook();
  const mainLoop = MainLoop(mainLoopStatsHook, RequestAnimationFrameScheduler());
  const statsReporter = StatsReporter(THREAD_DEBUG_NAME, statsReporterMessageChannel.port2);

  statsReporter.hooks.add(inputStatsHook);
  statsReporter.hooks.add(mainLoopStatsHook);

  // This is an unofficial Chrome JS extension so it's not typed by default.
  if ((globalThis.performance as any).memory) {
    const performanceStatsHook = PerformanceStatsHook();

    mainLoop.updatables.add(performanceStatsHook);
    statsReporter.hooks.add(performanceStatsHook);
  }

  const htmlElementResizeObserver = HTMLElementResizeObserver(canvasRoot, dimensionsState, mainLoop.tickTimerState);

  const keyboardObserver = KeyboardObserver(canvas, inputState, mainLoop.tickTimerState);
  const mouseObserver = MouseObserver(canvas, dimensionsState, inputState, mainLoop.tickTimerState);
  const touchObserver = TouchObserver(canvas, dimensionsState, inputState, mainLoop.tickTimerState);

  const userSettings = UserSettings.createEmptyState(devicePixelRatio);
  const userSettingsMessageChannel = createMultiThreadMessageChannel();
  const localStorageUserSettingsSync = LocalStorageUserSettingsSync(userSettings, isUserSettingsValid, THREAD_DEBUG_NAME);
  const multiThreadUserSettingsSync = MultiThreadUserSettingsSync(userSettings, userSettingsMessageChannel.port1, THREAD_DEBUG_NAME);

  const serviceManager = ServiceManager(logger);

  serviceManager.services.add(htmlElementResizeObserver);
  serviceManager.services.add(keyboardObserver);
  serviceManager.services.add(mouseObserver);
  serviceManager.services.add(MouseWheelObserver(canvas, eventBus, dimensionsState, inputState));
  serviceManager.services.add(touchObserver);
  serviceManager.services.add(localStorageUserSettingsSync);
  serviceManager.services.add(multiThreadUserSettingsSync);
  serviceManager.services.add(statsReporter);

  mainLoop.updatables.add(htmlElementResizeObserver);
  mainLoop.updatables.add(keyboardObserver);
  mainLoop.updatables.add(mouseObserver);
  mainLoop.updatables.add(touchObserver);
  mainLoop.updatables.add(inputStatsHook);
  mainLoop.updatables.add(localStorageUserSettingsSync);
  mainLoop.updatables.add(multiThreadUserSettingsSync);
  mainLoop.updatables.add(statsReporter);
  mainLoop.updatables.add(serviceManager);

  mainLoop.start();
  serviceManager.start();

  // Register service worker for PWA, offline use and caching.

  if (!navigator.serviceWorker) {
    throw new Error("Service worker is not supported.");
  }

  await ServiceWorkerManager(logger, `${__SERVICE_WORKER_BASE_PATH}/service_worker.js?${__CACHE_BUST}`).install();

  // Progress worker is used to gather information about assets and other
  // resources currently being loaded. It passess the summary information back,
  // so it's possible to render loading screen or do something else with that
  // information.

  const progressMessageChannel = createMultiThreadMessageChannel();
  const progressWorker = new Worker(`${__STATIC_BASE_PATH}${workers.progress.url}?${__CACHE_BUST}`, {
    credentials: "same-origin",
    name: workers.progress.name,
    type: "module",
  });

  const progressWorkerService = WorkerService(progressWorker, workers.progress.name);

  await progressWorkerService.ready();

  mainLoop.updatables.add(progressWorkerService);
  serviceManager.services.add(progressWorkerService);

  function addProgressMessagePort(messagePort: MessagePort, broadcastProgress: boolean) {
    progressWorker.postMessage(
      {
        progressMessagePort: {
          broadcastProgress: broadcastProgress,
          messagePort: messagePort,
        },
      },
      [messagePort]
    );
  }

  addProgressMessagePort(progressMessageChannel.port1, true);

  // DOMUiController handles DOM rendering using reconciliated routes.

  const uiMessageChannel = createMultiThreadMessageChannel();
  const domUIController = DOMUIController(logger, inputState, mainLoop.tickTimerState, uiMessageChannel.port1, uiRoot, userSettings, domElementsLookup);

  domUIController.preload();

  mainLoop.updatables.add(domUIController);
  serviceManager.services.add(domUIController);

  // Stats collector reports debug stats like FPS, memory usage, etc.

  const statsMessageChannel = createMultiThreadMessageChannel();
  const statsToDOMRendererMessageChannel = createSingleThreadMessageChannel();
  const statsCollector = StatsCollector(userSettings, statsToDOMRendererMessageChannel.port2);

  domUIController.registerMessagePort(statsToDOMRendererMessageChannel.port1);
  statsCollector.registerMessagePort(statsReporterMessageChannel.port1);
  statsCollector.registerMessagePort(statsMessageChannel.port1);

  const statsCollectorUserSettingsManager = StatsCollectorUserSettingsManager(userSettings, statsCollector);

  serviceManager.services.add(statsCollectorUserSettingsManager);
  mainLoop.updatables.add(statsCollectorUserSettingsManager);

  // FontPreloadService does exactly what its name says. Thanks to this
  // service it is possible for worker threads to request font face to be
  // preloaded, display loading indicator and receive notification back when
  // it's ready. Thanks to that, there should be no UI twitching while fonts
  // are being loaded.

  const fontPreloadMessageChannel = createMultiThreadMessageChannel();
  const fontPreloadToProgressMessageChannel = createMultiThreadMessageChannel();

  addProgressMessagePort(fontPreloadToProgressMessageChannel.port1, false);

  const fontPreloadService = FontPreloadService(fontPreloadMessageChannel.port1, fontPreloadToProgressMessageChannel.port2);

  serviceManager.services.add(fontPreloadService);

  // `createImageBitmap` has its quirks and surprisingly has no support in
  // safari and ios. Also, it has partial support in Firefox.
  // If it's not supported, then we have to use the main thread to
  // generate textures and potentially send them into other workers.

  const textureCanvas = document.createElement("canvas");
  const textureCanvasContext2D = textureCanvas.getContext("2d");

  if (null === textureCanvasContext2D) {
    throw new Error("Unable to get detached canvas 2D context.");
  }

  const texturesMessageChannel = createMultiThreadMessageChannel();
  const texturesToProgressMessageChannel = createMultiThreadMessageChannel();

  addProgressMessagePort(texturesToProgressMessageChannel.port1, false);

  const addTextureMessagePort = await (async function () {
    if (await isCreateImageBitmapSupported(supportCache)) {
      logger.info("SUPPORTED(createImageBitmap) // offload texture service to a worker thread");

      const texturesWorker = new Worker(`${__STATIC_BASE_PATH}${workers.textures.url}?${__CACHE_BUST}`, {
        credentials: "same-origin",
        name: workers.textures.name,
        type: "module",
      });

      texturesWorker.postMessage(
        {
          progressMessagePort: texturesToProgressMessageChannel.port2,
        },
        [texturesToProgressMessageChannel.port2]
      );

      return function (messagePort: MessagePort) {
        texturesWorker.postMessage(
          {
            texturesMessagePort: messagePort,
          },
          [messagePort]
        );
      };
    } else {
      logger.info("NO_SUPPORT(createImageBitmap) // starting texture service in the main thread");

      const textureService = DOMTextureService(textureCanvas, textureCanvasContext2D, texturesToProgressMessageChannel.port2);

      mainLoop.updatables.add(textureService);
      serviceManager.services.add(textureService);

      return textureService.registerMessagePort;
    }
  })();

  addTextureMessagePort(texturesMessageChannel.port1);

  // Atlas canvas is used to speed up texture atlas creation.

  const atlasCanvas = document.createElement("canvas");
  const atlasMessageChannel = createMultiThreadMessageChannel();
  const atlasToTextureMessageChannel = createMultiThreadMessageChannel();
  const atlasToProgressMessageChannel = createMultiThreadMessageChannel();
  const atlasToStatsMessageChannel = createMultiThreadMessageChannel();

  addProgressMessagePort(atlasToProgressMessageChannel.port1, false);
  addTextureMessagePort(atlasToTextureMessageChannel.port1);
  statsCollector.registerMessagePort(atlasToStatsMessageChannel.port1);

  const addAtlasMessagePort = await (async function () {
    if (await isCanvasTransferControlToOffscreenSupported(supportCache)) {
      logger.info("SUPPORTED(canvas.transferControlToOffscreen) // offlad atlas service to a worker thread");

      const offscreenAtlas = atlasCanvas.transferControlToOffscreen();
      const atlasWorker = new Worker(`${__STATIC_BASE_PATH}${workers.atlas.url}?${__CACHE_BUST}`, {
        credentials: "same-origin",
        name: workers.atlas.name,
        type: "module",
      });

      atlasWorker.postMessage(
        {
          atlasCanvas: offscreenAtlas,
          progressMessagePort: atlasToProgressMessageChannel.port2,
          statsMessagePort: atlasToStatsMessageChannel.port2,
          texturesMessagePort: atlasToTextureMessageChannel.port2,
        },
        [atlasToProgressMessageChannel.port2, atlasToStatsMessageChannel.port2, atlasToTextureMessageChannel.port2, offscreenAtlas]
      );

      const atlasWorkerService = WorkerService(atlasWorker, workers.atlas.name);

      await atlasWorkerService.ready();

      mainLoop.updatables.add(atlasWorkerService);
      serviceManager.services.add(atlasWorkerService);

      return function (messagePort: MessagePort) {
        atlasWorker.postMessage(
          {
            atlasMessagePort: messagePort,
          },
          [messagePort]
        );
      };
    } else {
      logger.info("NO_SUPPORT(canvas.transferControlToOffscreen) // starting atlas service in the main thread");

      const atlasCanvasContext2D = atlasCanvas.getContext("2d");

      if (null === atlasCanvasContext2D) {
        throw new Error("Unable to get atlas canvas 2D context.");
      }

      const atlasService = AtlasService(atlasCanvas, atlasCanvasContext2D, atlasToProgressMessageChannel.port2, atlasToTextureMessageChannel.port2);

      mainLoop.updatables.add(atlasService);
      serviceManager.services.add(atlasService);

      return atlasService.registerMessagePort;
    }
  })();

  addAtlasMessagePort(atlasMessageChannel.port1);

  // Workers can share a message channel if necessary. If there is no offscreen
  // worker then the message channel can be used in the main thread. It is an
  // overhead, but unifies how messages are handled in each case.

  const quakeMapsMessageChannel = createMultiThreadMessageChannel();
  const quakeMapsToProgressMessageChannel = createMultiThreadMessageChannel();

  addProgressMessagePort(quakeMapsToProgressMessageChannel.port1, false);

  const quakeMapsWorker = new Worker(`${__STATIC_BASE_PATH}${workers.quakemaps.url}?${__CACHE_BUST}`, {
    credentials: "same-origin",
    name: workers.quakemaps.name,
    type: "module",
  });

  quakeMapsWorker.postMessage(
    {
      atlasMessagePort: atlasMessageChannel.port2,
      progressMessagePort: quakeMapsToProgressMessageChannel.port2,
      quakeMapsMessagePort: quakeMapsMessageChannel.port1,
    },
    [atlasMessageChannel.port2, quakeMapsMessageChannel.port1, quakeMapsToProgressMessageChannel.port2]
  );

  // MD2 worker offloads model loading from the thread whether it's the main
  // browser thread or the offscreen canvas thread. Loading MD2 models cause
  // rendering to stutter.

  const md2MessageChannel = createMultiThreadMessageChannel();
  const md2ToProgressMessageChannel = createMultiThreadMessageChannel();

  addProgressMessagePort(md2ToProgressMessageChannel.port1, false);

  const md2Worker = new Worker(`${__STATIC_BASE_PATH}${workers.md2.url}?${__CACHE_BUST}`, {
    credentials: "same-origin",
    name: workers.md2.name,
    type: "module",
  });

  md2Worker.postMessage(
    {
      md2MessagePort: md2MessageChannel.port1,
      progressMessagePort: md2ToProgressMessageChannel.port2,
    },
    [md2MessageChannel.port1, md2ToProgressMessageChannel.port2]
  );

  // If browser supports the offscreen canvas, then we can offload everything
  // there. If not, then we continue in the main thread.

  if (await isCanvasTransferControlToOffscreenSupported(supportCache)) {
    logger.info("SUPPORTED(canvas.transferControlToOffscreen) // offlad 3D canvas to a worker thread");

    const offscreenWorker = new Worker(`${__STATIC_BASE_PATH}${workers.offscreen.url}?${__CACHE_BUST}`, {
      credentials: "same-origin",
      name: workers.offscreen.name,
      type: "module",
    });

    const offscreenCanvas = canvas.transferControlToOffscreen();

    // SharedArrayBuffer was disabled after Spectre / Meltdown attacks.
    // After some time it got enabled again, so it's a bit messy.
    // If it's enabled, then we should use it, otherwise the app will be sending
    // copy of input / dimensions states every frame to the worker.
    const offscreenWorkerService = (function () {
      function sharedArrayBufferNotAvailable() {
        logger.info("NO_SUPPORT(SharedArrayBuffer) // starting dimensions/input sync service");

        offscreenWorker.postMessage({
          awaitSharedDimensions: false,
        });

        let _lastNotificationTick = 0;
        const updateMessage = {
          dimensionsState: dimensionsState,
          inputState: inputState,
        };

        return WorkerService(offscreenWorker, workers.offscreen.name, function () {
          // prettier-ignore
          if ( _lastNotificationTick < dimensionsState[DimensionsIndices.LAST_UPDATE]
            || _lastNotificationTick < inputState[InputIndices.LAST_UPDATE]
          ) {
            offscreenWorker.postMessage(updateMessage);
            _lastNotificationTick = mainLoop.tickTimerState.currentTick;
          }
        });
      }

      if (useSharedBuffers) {
        try {
          offscreenWorker.postMessage({
            awaitSharedDimensions: true,
            sharedDimensionsState: dimensionsState.buffer,
            sharedInputState: inputState.buffer,
          });
        } catch (err) {
          // In some cases, `postMessage` will throw when trying to send
          // SharedArrayBuffer to a worker. In that case we can fallback to
          // the copy / update strategy.
          return sharedArrayBufferNotAvailable();
        }

        logger.info("SUPPORTED(SharedArrayBuffer) // sharing dimensions/input memory array between threads");

        return WorkerService(offscreenWorker, workers.offscreen.name);
      } else {
        return sharedArrayBufferNotAvailable();
      }
    })();

    const domRendererMessageChannel = createMultiThreadMessageChannel();

    domUIController.registerMessagePort(domRendererMessageChannel.port1);

    // prettier-ignore
    offscreenWorker.postMessage(
      {
        canvas: offscreenCanvas,
        devicePixelRatio: devicePixelRatio,
        domMessagePort: domRendererMessageChannel.port2,
        fontPreloadMessagePort: fontPreloadMessageChannel.port2,
        md2MessagePort: md2MessageChannel.port2,
        progressMessagePort: progressMessageChannel.port2,
        quakeMapsMessagePort: quakeMapsMessageChannel.port2,
        statsMessagePort: statsMessageChannel.port2,
        texturesMessagePort: texturesMessageChannel.port2,
        uiMessagePort: uiMessageChannel.port2,
        userSettingsMessagePort: userSettingsMessageChannel.port2,
      },
      [
        domRendererMessageChannel.port2,
        fontPreloadMessageChannel.port2,
        md2MessageChannel.port2,
        offscreenCanvas,
        statsMessageChannel.port2,
        progressMessageChannel.port2,
        quakeMapsMessageChannel.port2,
        texturesMessageChannel.port2,
        uiMessageChannel.port2,
        userSettingsMessageChannel.port2,
      ]
    );

    const offscreenWorkerZoomRequestMessage = {
      pointerZoomRequest: 0,
    };

    eventBus.POINTER_ZOOM_REQUEST.add(function (zoomAmount: number): void {
      offscreenWorkerZoomRequestMessage.pointerZoomRequest = zoomAmount;
      offscreenWorker.postMessage(offscreenWorkerZoomRequestMessage);
    });

    await offscreenWorkerService.ready();

    mainLoop.updatables.add(offscreenWorkerService);
    serviceManager.services.add(offscreenWorkerService);
  } else {
    logger.info("NO_SUPPORT(canvas.transferControlToOffscreen) // starting 3D canvas in the main thread");

    /**
     * This extra var is a hack to make esbuild leave the dynamic import as-is.
     * @see https://github.com/evanw/esbuild/issues/56#issuecomment-643100248
     * @see https://github.com/evanw/esbuild/issues/113
     */
    const _dynamicImport = `${__STATIC_BASE_PATH}/lib/createScenes.js`;
    const { createScenes } = await (async function () {
      try {
        return await import(_dynamicImport);
      } catch (err) {
        throw err;
      }
    })();

    const domRendererMessageChannel = createSingleThreadMessageChannel();

    domUIController.registerMessagePort(domRendererMessageChannel.port1);

    // prettier-ignore
    createScenes(
      THREAD_DEBUG_NAME,
      devicePixelRatio,
      eventBus,
      mainLoop,
      serviceManager,
      canvas,
      dimensionsState,
      inputState,
      logger,
      statsReporter,
      domRendererMessageChannel.port2,
      fontPreloadMessageChannel.port2,
      md2MessageChannel.port2,
      progressMessageChannel.port2,
      quakeMapsMessageChannel.port2,
      statsMessageChannel.port2,
      texturesMessageChannel.port2,
      uiMessageChannel.port2,
      userSettingsMessageChannel.port2,
    );
  }
})();
