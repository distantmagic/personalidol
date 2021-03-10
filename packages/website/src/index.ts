import Loglevel from "loglevel";

import { createMultiThreadMessageChannel } from "@personalidol/framework/src/createMultiThreadMessageChannel";
import { createSingleThreadMessageChannel } from "@personalidol/framework/src/createSingleThreadMessageChannel";
import { DimensionsState } from "@personalidol/framework/src/DimensionsState";
import { domElementsLookup } from "@personalidol/personalidol/src/domElementsLookup";
import { DOMUIController } from "@personalidol/dom-renderer/src/DOMUIController";
import { EventBus } from "@personalidol/framework/src/EventBus";
import { FontPreloadService } from "@personalidol/dom-renderer/src/FontPreloadService";
import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { HTMLElementResizeObserver } from "@personalidol/framework/src/HTMLElementResizeObserver";
import { InternationalizationService } from "@personalidol/i18n/src/InternationalizationService";
import { isSharedArrayBufferSupported } from "@personalidol/framework/src/isSharedArrayBufferSupported";
import { isUserSettingsValid } from "@personalidol/personalidol/src/isUserSettingsValid";
import { KeyboardObserver } from "@personalidol/framework/src/KeyboardObserver";
import { KeyboardState } from "@personalidol/framework/src/KeyboardState";
import { LanguageUserSettingsManager } from "@personalidol/personalidol/src/LanguageUserSettingsManager";
import { LocalStorageUserSettingsSync } from "@personalidol/framework/src/LocalStorageUserSettingsSync";
import { MainLoop } from "@personalidol/framework/src/MainLoop";
import { MainLoopStatsHook } from "@personalidol/framework/src/MainLoopStatsHook";
import { MouseObserver } from "@personalidol/framework/src/MouseObserver";
import { MouseState } from "@personalidol/framework/src/MouseState";
import { MouseWheelObserver } from "@personalidol/framework/src/MouseWheelObserver";
import { MultiThreadUserSettingsSync } from "@personalidol/framework/src/MultiThreadUserSettingsSync";
import { PerformanceStatsHook } from "@personalidol/framework/src/PerformanceStatsHook";
import { preload } from "@personalidol/framework/src/preload";
import { RequestAnimationFrameScheduler } from "@personalidol/framework/src/RequestAnimationFrameScheduler";
import { ServiceManager } from "@personalidol/framework/src/ServiceManager";
import { ServiceWorkerManager } from "@personalidol/service-worker/src/ServiceWorkerManager";
import { StatsCollector } from "@personalidol/dom-renderer/src/StatsCollector";
import { StatsReporter } from "@personalidol/framework/src/StatsReporter";
import { TouchObserver } from "@personalidol/framework/src/TouchObserver";
import { TouchState } from "@personalidol/framework/src/TouchState";
import { UserSettings } from "@personalidol/personalidol/src/UserSettings";
import { WindowFocusObserver } from "@personalidol/framework/src/WindowFocusObserver";
import { WorkerServiceClient } from "@personalidol/framework/src/WorkerServiceClient";

// This is a workaround for i18n typing strongly tied to the module.
// It resolves typing issues, but requires to really keep exactly the same
// version across modules (which is ok).
import type { i18n as DOMi18n } from "@personalidol/dom-renderer/node_modules/i18next/index";
import type { i18n as Frameworki18n } from "@personalidol/framework/node_modules/i18next/index";
import type { i18n as PersonalIdoli18n } from "@personalidol/personalidol/node_modules/i18next/index";

import workers from "./workers.json";
import { createAtlasService } from "./createAtlasService";
import { createI18next } from "./createI18next";
import { createRenderingService } from "./createRenderingService";
import { createTexturesService } from "./createTexturesService";

const THREAD_DEBUG_NAME: string = "main_thread";
const totalLoadingSteps: number = 12;
let currentLoadingStep: number = 1;

const canvasRoot = getHTMLElementById(window.document, "canvas-root");
const uiRoot = getHTMLElementById(window.document, "ui-root");

// The entire bootstrap code is wrapped to allow 'await'. Global await is not
// widely supported yet.
// Depending on browser feature support, some workers will be started or not.
// Checking for features is asynchronous.
async function bootstrap() {
  const canvas = getHTMLElementById(window.document, "canvas");

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Canvas is not an instance of HTMLCanvasElement");
  }

  const devicePixelRatio = window.devicePixelRatio;
  const logger = Loglevel.getLogger(THREAD_DEBUG_NAME);

  logger.setLevel(__LOG_LEVEL);
  logger.debug(`BUILD_ID("${__BUILD_ID}")`);

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "service_worker",
      },
    })
  );

  // Services that need to stay in the main browser thread, because they need
  // access to the DOM API.

  const useSharedBuffers = isSharedArrayBufferSupported();
  const dimensionsState = DimensionsState.createEmptyState(useSharedBuffers);
  const keyboardState = KeyboardState.createEmptyState(useSharedBuffers);

  const mouseState = MouseState.createEmptyState(useSharedBuffers);
  const touchState = TouchState.createEmptyState(useSharedBuffers);

  const eventBus = EventBus();
  const statsReporterMessageChannel = createSingleThreadMessageChannel();

  const mainLoop = MainLoop(logger, RequestAnimationFrameScheduler());

  const htmlElementResizeObserver = HTMLElementResizeObserver(canvasRoot, dimensionsState, mainLoop.tickTimerState);

  const windowFocusObserver = WindowFocusObserver(logger, mainLoop.tickTimerState);
  const keyboardObserver = KeyboardObserver(logger, canvas, keyboardState, windowFocusObserver.state, mainLoop.tickTimerState);
  const mouseObserver = MouseObserver(canvas, dimensionsState, mouseState, windowFocusObserver.state, mainLoop.tickTimerState);
  const touchObserver = TouchObserver(canvas, dimensionsState, touchState, windowFocusObserver.state, mainLoop.tickTimerState);

  const userSettings = UserSettings.createEmptyState(devicePixelRatio);
  const userSettingsMessageChannel = createMultiThreadMessageChannel();
  const localStorageUserSettingsSync = LocalStorageUserSettingsSync(userSettings, isUserSettingsValid, THREAD_DEBUG_NAME);
  const multiThreadUserSettingsSync = MultiThreadUserSettingsSync(userSettings, userSettingsMessageChannel.port1, THREAD_DEBUG_NAME);

  const statsReporter = StatsReporter(THREAD_DEBUG_NAME, userSettings, statsReporterMessageChannel.port2, mainLoop.tickTimerState);

  statsReporter.hooks.add(MainLoopStatsHook(mainLoop));

  // This is an unofficial Chrome JS extension so it's not typed by default.
  if ((globalThis.performance as any).memory) {
    statsReporter.hooks.add(PerformanceStatsHook());
  }

  const serviceManager = ServiceManager(logger);

  serviceManager.services.add(htmlElementResizeObserver);
  serviceManager.services.add(windowFocusObserver);
  serviceManager.services.add(keyboardObserver);
  serviceManager.services.add(mouseObserver);
  serviceManager.services.add(MouseWheelObserver(canvas, eventBus, dimensionsState, mouseState));
  serviceManager.services.add(touchObserver);
  serviceManager.services.add(localStorageUserSettingsSync);
  serviceManager.services.add(multiThreadUserSettingsSync);
  serviceManager.services.add(statsReporter);

  mainLoop.updatables.add(htmlElementResizeObserver);
  mainLoop.updatables.add(windowFocusObserver);
  mainLoop.updatables.add(keyboardObserver);
  mainLoop.updatables.add(mouseObserver);
  mainLoop.updatables.add(touchObserver);
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

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "progress_service",
      },
    })
  );

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

  const progressWorkerServiceClient = WorkerServiceClient(progressWorker, workers.progress.name);

  await progressWorkerServiceClient.ready();

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "translations",
      },
    })
  );

  mainLoop.updatables.add(progressWorkerServiceClient);
  serviceManager.services.add(progressWorkerServiceClient);

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

  // Preload translations and the internationalization service.

  const i18next = createI18next(logger);
  const internationalizationToProgressMessageChannel = createMultiThreadMessageChannel();
  const internationalizationService = InternationalizationService(i18next as Frameworki18n, internationalizationToProgressMessageChannel.port2);
  const internationalizationMessageChannel = createMultiThreadMessageChannel();

  addProgressMessagePort(internationalizationToProgressMessageChannel.port1, false);
  internationalizationService.registerMessagePort(internationalizationMessageChannel.port1);

  await preload(logger, internationalizationService);

  serviceManager.services.add(internationalizationService);

  // Listen to user settings to adjust the language.

  const languageUserSettingsManager = LanguageUserSettingsManager(userSettings, i18next as PersonalIdoli18n);

  await preload(logger, languageUserSettingsManager);

  mainLoop.updatables.add(languageUserSettingsManager);

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "dom_controller",
      },
    })
  );

  // DOMUiController handles DOM rendering using reconciliated routes.

  const uiMessageChannel = createMultiThreadMessageChannel();

  const domUIController = DOMUIController(
    logger,
    internationalizationService.i18next as DOMi18n,
    dimensionsState,
    keyboardState,
    mouseState,
    touchState,
    mainLoop,
    uiMessageChannel.port1,
    uiRoot,
    userSettings,
    domElementsLookup
  );

  await preload(logger, domUIController);

  serviceManager.services.add(domUIController);

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        isDOMControllerReady: true,
        step: currentLoadingStep++,
        type: "textures_service",
        totalSteps: totalLoadingSteps,
      },
    })
  );

  // Stats collector reports debug stats like FPS, memory usage, etc.

  const statsMessageChannel = createMultiThreadMessageChannel();
  const statsToDOMRendererMessageChannel = createSingleThreadMessageChannel();
  const statsCollector = StatsCollector(userSettings, statsToDOMRendererMessageChannel.port2);

  domUIController.registerMessagePort(statsToDOMRendererMessageChannel.port1);
  statsCollector.registerMessagePort(statsReporterMessageChannel.port1);
  statsCollector.registerMessagePort(statsMessageChannel.port1);

  serviceManager.services.add(statsCollector);
  mainLoop.updatables.add(statsCollector);

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

  const texturesMessageChannel = createMultiThreadMessageChannel();
  const texturesToProgressMessageChannel = createMultiThreadMessageChannel();

  addProgressMessagePort(texturesToProgressMessageChannel.port1, false);

  const texturesService = await createTexturesService(logger, mainLoop, serviceManager, texturesToProgressMessageChannel.port2);

  texturesService.registerMessagePort(texturesMessageChannel.port1);

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "atlas_service",
      },
    })
  );

  // Atlas canvas is used to speed up texture atlas creation.

  const atlasMessageChannel = createMultiThreadMessageChannel();
  const atlasToTextureMessageChannel = createMultiThreadMessageChannel();
  const atlasToProgressMessageChannel = createMultiThreadMessageChannel();
  const atlasToStatsMessageChannel = createMultiThreadMessageChannel();

  addProgressMessagePort(atlasToProgressMessageChannel.port1, false);
  texturesService.registerMessagePort(atlasToTextureMessageChannel.port1);
  statsCollector.registerMessagePort(atlasToStatsMessageChannel.port1);

  const atlasService = await createAtlasService(
    logger,
    mainLoop,
    serviceManager,
    atlasToProgressMessageChannel.port2,
    atlasToStatsMessageChannel.port2,
    atlasToTextureMessageChannel.port2
  );

  atlasService.registerMessagePort(atlasMessageChannel.port1);

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "maps_service",
      },
    })
  );

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

  const quakeMapsWorkerServiceClient = WorkerServiceClient(quakeMapsWorker, workers.quakemaps.name);
  await quakeMapsWorkerServiceClient.ready();

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "gltf_service",
      },
    })
  );

  quakeMapsWorker.postMessage(
    {
      atlasMessagePort: atlasMessageChannel.port2,
      progressMessagePort: quakeMapsToProgressMessageChannel.port2,
      quakeMapsMessagePort: quakeMapsMessageChannel.port1,
    },
    [atlasMessageChannel.port2, quakeMapsMessageChannel.port1, quakeMapsToProgressMessageChannel.port2]
  );

  // GLTF loader offloads model loading from the rendering thread.

  const gltfMessageChannel = createMultiThreadMessageChannel();
  const gltfToProgressMessageChannel = createMultiThreadMessageChannel();

  addProgressMessagePort(gltfToProgressMessageChannel.port1, false);

  const gltfWorker = new Worker(`${__STATIC_BASE_PATH}${workers.gltf.url}?${__CACHE_BUST}`, {
    credentials: "same-origin",
    name: workers.gltf.name,
    type: "module",
  });

  const gltfWorkerServiceClient = WorkerServiceClient(gltfWorker, workers.gltf.name);
  await gltfWorkerServiceClient.ready();

  gltfWorker.postMessage(
    {
      gltfMessagePort: gltfMessageChannel.port1,
      progressMessagePort: gltfToProgressMessageChannel.port2,
    },
    [gltfMessageChannel.port1, gltfToProgressMessageChannel.port2]
  );

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "md2_service",
      },
    })
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

  const md2WorkerServiceClient = WorkerServiceClient(md2Worker, workers.md2.name);
  await md2WorkerServiceClient.ready();

  md2Worker.postMessage(
    {
      md2MessagePort: md2MessageChannel.port1,
      progressMessagePort: md2ToProgressMessageChannel.port2,
    },
    [md2MessageChannel.port1, md2ToProgressMessageChannel.port2]
  );

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "rendering_service",
      },
    })
  );

  // If browser supports the offscreen canvas, then we can offload everything
  // there. If not, then we continue in the main thread.

  const createScenes = await createRenderingService(
    logger,
    mainLoop,
    serviceManager,
    canvas,
    devicePixelRatio,
    domUIController,
    dimensionsState,
    eventBus,
    keyboardObserver.state,
    keyboardState,
    mouseObserver.state,
    mouseState,
    touchState,
    statsReporter,
    THREAD_DEBUG_NAME,
    touchObserver.state,
    userSettings
  );

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "scenes",
      },
    })
  );

  await createScenes(
    fontPreloadMessageChannel.port2,
    gltfMessageChannel.port2,
    internationalizationMessageChannel.port2,
    md2MessageChannel.port2,
    progressMessageChannel.port2,
    quakeMapsMessageChannel.port2,
    statsMessageChannel.port2,
    texturesMessageChannel.port2,
    uiMessageChannel.port2,
    userSettingsMessageChannel.port2
  );
}

(async function () {
  try {
    await bootstrap();
  } catch (err) {
    uiRoot.dispatchEvent(
      new CustomEvent("error", {
        detail: err,
      })
    );
  }
})();
