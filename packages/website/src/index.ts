import Loglevel from "loglevel";

import { createMultiThreadMessageChannel } from "@personalidol/framework/src/createMultiThreadMessageChannel";
import { createSingleThreadMessageChannel } from "@personalidol/framework/src/createSingleThreadMessageChannel";
import { Dimensions } from "@personalidol/framework/src/Dimensions";
import { domElementsLookup } from "@personalidol/personalidol/src/domElementsLookup";
import { DOMUIController } from "@personalidol/dom-renderer/src/DOMUIController";
import { EventBus } from "@personalidol/framework/src/EventBus";
import { FontPreloadService } from "@personalidol/dom-renderer/src/FontPreloadService";
import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { HTMLElementResizeObserver } from "@personalidol/framework/src/HTMLElementResizeObserver";
import { Input } from "@personalidol/framework/src/Input";
import { InputStatsHook } from "@personalidol/framework/src/InputStatsHook";
import { InternationalizationService } from "@personalidol/i18n/src/InternationalizationService";
import { isSharedArrayBufferSupported } from "@personalidol/support/src/isSharedArrayBufferSupported";
import { isUserSettingsValid } from "@personalidol/personalidol/src/isUserSettingsValid";
import { KeyboardObserver } from "@personalidol/framework/src/KeyboardObserver";
import { LanguageUserSettingsManager } from "@personalidol/personalidol/src/LanguageUserSettingsManager";
import { LocalStorageUserSettingsSync } from "@personalidol/framework/src/LocalStorageUserSettingsSync";
import { MainLoop } from "@personalidol/framework/src/MainLoop";
import { MainLoopStatsHook } from "@personalidol/framework/src/MainLoopStatsHook";
import { MouseObserver } from "@personalidol/framework/src/MouseObserver";
import { MouseWheelObserver } from "@personalidol/framework/src/MouseWheelObserver";
import { MultiThreadUserSettingsSync } from "@personalidol/framework/src/MultiThreadUserSettingsSync";
import { PerformanceStatsHook } from "@personalidol/framework/src/PerformanceStatsHook";
import { preload } from "@personalidol/framework/src/preload";
import { RequestAnimationFrameScheduler } from "@personalidol/framework/src/RequestAnimationFrameScheduler";
import { ServiceManager } from "@personalidol/framework/src/ServiceManager";
import { ServiceWorkerManager } from "@personalidol/service-worker/src/ServiceWorkerManager";
import { StatsCollector } from "@personalidol/dom-renderer/src/StatsCollector";
import { StatsCollectorUserSettingsManager } from "@personalidol/dom-renderer/src/StatsCollectorUserSettingsManager";
import { StatsReporter } from "@personalidol/framework/src/StatsReporter";
import { TouchObserver } from "@personalidol/framework/src/TouchObserver";
import { UserSettings } from "@personalidol/personalidol/src/UserSettings";
import { WorkerService } from "@personalidol/framework/src/WorkerService";

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
const canvas = getHTMLElementById(window.document, "canvas");
const totalLoadingSteps: number = 11;
let currentLoadingStep: number = 1;

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Canvas is not an instance of HTMLCanvasElement");
}

const devicePixelRatio = window.devicePixelRatio;
const logger = Loglevel.getLogger(THREAD_DEBUG_NAME);

logger.setLevel(__LOG_LEVEL);

const canvasRoot = getHTMLElementById(window.document, "canvas-root");
const uiRoot = getHTMLElementById(window.document, "ui-root");

// The entire bootstrap code is wrapped to allow 'await'. Global await is not
// widely supported yet.
// Depending on browser feature support, some workers will be started or not.
// Checking for features is asynchronous.
(async function () {
  logger.info(`BUILD_ID("${__BUILD_ID}")`);

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
  const dimensionsState = Dimensions.createEmptyState(useSharedBuffers);
  const inputState = Input.createEmptyState(useSharedBuffers);
  const inputStatsHook = InputStatsHook(inputState);

  const eventBus = EventBus();
  const statsReporterMessageChannel = createSingleThreadMessageChannel();

  const mainLoopStatsHook = MainLoopStatsHook();
  const mainLoop = MainLoop(logger, mainLoopStatsHook, RequestAnimationFrameScheduler());
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

  const progressWorkerService = WorkerService(progressWorker, workers.progress.name);

  await progressWorkerService.ready();

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "translations",
      },
    })
  );

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

  // Preload translations and the internationalization service.

  const i18next = createI18next();
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
    inputState,
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

  const quakeMapsWorkerService = WorkerService(quakeMapsWorker, workers.quakemaps.name);
  await quakeMapsWorkerService.ready();

  uiRoot.dispatchEvent(
    new CustomEvent("loading", {
      detail: {
        step: currentLoadingStep++,
        totalSteps: totalLoadingSteps,
        type: "md2_service",
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

  const md2WorkerService = WorkerService(md2Worker, workers.md2.name);
  await md2WorkerService.ready();

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
    inputState,
    statsReporter,
    THREAD_DEBUG_NAME,
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
    internationalizationMessageChannel.port2,
    md2MessageChannel.port2,
    progressMessageChannel.port2,
    quakeMapsMessageChannel.port2,
    statsMessageChannel.port2,
    texturesMessageChannel.port2,
    uiMessageChannel.port2,
    userSettingsMessageChannel.port2
  );
})();
