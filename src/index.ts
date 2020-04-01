import * as THREE from "three";

import BusClock from "src/framework/classes/BusClock";
import CameraFrustumBus from "src/framework/classes/CameraFrustumBus";
import CancelToken from "src/framework/classes/CancelToken";
import CanvasControllerBus from "src/framework/classes/CanvasControllerBus";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import Exception from "src/framework/classes/Exception";
import ExceptionHandler from "src/framework/classes/ExceptionHandler";
import HTMLElementSizeObserver from "src/framework/classes/HTMLElementSizeObserver";
import KeyboardState from "src/framework/classes/KeyboardState";
import LoadingManager from "src/framework/classes/LoadingManager";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import MainLoop from "src/framework/classes/MainLoop";
import PhysicsWorld from "src/framework/classes/PhysicsWorld";
import PointerState from "src/framework/classes/PointerState";
import QueryBus from "src/framework/classes/QueryBus";
import Scheduler from "src/framework/classes/Scheduler";
import { default as ConsoleLogger } from "src/framework/classes/Logger/Console";
import { default as LoadingScreenController } from "src/framework/classes/CanvasController/LoadingScreen";
import { default as RootCanvasController } from "src/framework/classes/CanvasController/Root";
import { default as UnexpectedExceptionHandlerFilter } from "src/framework/classes/ExceptionHandlerFilter/Unexpected";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

// import * as serviceWorker from "src/serviceWorker";

const rootCanvasElement = document.getElementById("dd-canvas");

if (!rootCanvasElement) {
  throw new Error("Root element not found.");
}

if (!(rootCanvasElement instanceof HTMLCanvasElement)) {
  throw new Error("Root element is not a canvas.");
}

const busClock = new BusClock();
const loggerBreadcrumbs = new LoggerBreadcrumbs();
const logger = new ConsoleLogger();
const cancelToken = new CancelToken(loggerBreadcrumbs.add("CancelToken"));
const exceptionHandlerFilter = new UnexpectedExceptionHandlerFilter();
const exceptionHandler = new ExceptionHandler(logger, exceptionHandlerFilter);
const queryBus = new QueryBus(exceptionHandler, loggerBreadcrumbs.add("QueryBus"));
const loadingManager = new LoadingManager(loggerBreadcrumbs.add("LoadingManager"), exceptionHandler);
const threeLoadingManager = new THREE.LoadingManager();

const scheduler = new Scheduler(loggerBreadcrumbs.add("Scheduler"));
const keyboardState = new KeyboardState(loggerBreadcrumbs.add("KeyboardState"));
const mainLoop = new MainLoop(loggerBreadcrumbs.add("MainLoop"), scheduler);
const mainLoopControlToken = mainLoop.getControllable().obtainControlToken();

// mainLoop.setMaxAllowedFPS(80);

if ("visible" === window.document.visibilityState) {
  mainLoop.start(mainLoopControlToken);
}

busClock.interval(cancelToken, queryBus.tick);

window.addEventListener("beforeunload", function () {
  cancelToken.cancel(loggerBreadcrumbs.add("beforeunload"));
});

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    mainLoop.start(mainLoopControlToken);
  } else {
    mainLoop.stop(mainLoopControlToken);
  }
});

bootstrap(rootCanvasElement);

async function bootstrap(sceneCanvas: HTMLCanvasElement) {
  function onWindowResize() {
    sceneCanvas.style.height = `${window.innerHeight}px`;
    sceneCanvas.style.width = `${window.innerWidth}px`;
  }

  const gameCamera = new THREE.PerspectiveCamera();
  const cameraFrustumBus = new CameraFrustumBus(loggerBreadcrumbs.add("CameraFrustumBus"), gameCamera);
  const physicsWorld = new PhysicsWorld(loggerBreadcrumbs.add("PhysicsWorld"));
  const pointerState = new PointerState(loggerBreadcrumbs.add("PointerState"), sceneCanvas);
  const resizeObserver = new HTMLElementSizeObserver(loggerBreadcrumbs.add("HTMLElementSizeObserver"), sceneCanvas);
  const canvasControllerBus = new CanvasControllerBus(loggerBreadcrumbs, resizeObserver, scheduler);

  canvasControllerBus.observe();
  keyboardState.observe();
  pointerState.observe();
  resizeObserver.observe();

  if (SchedulerUpdateScenario.Always === busClock.useUpdate()) {
    scheduler.update.add(busClock.update);
  }
  if (SchedulerUpdateScenario.Always === cameraFrustumBus.useUpdate()) {
    scheduler.update.add(cameraFrustumBus.update);
  }
  if (SchedulerUpdateScenario.Always === physicsWorld.useUpdate()) {
    scheduler.update.add(physicsWorld.update);
  }

  window.addEventListener("resize", onWindowResize);
  onWindowResize();

  const rendererContext = sceneCanvas.getContext("webgl");

  if (!rendererContext) {
    throw new Exception(loggerBreadcrumbs, "Unable to get rendering context.");
  }

  const renderer = new THREE.WebGLRenderer({
    alpha: false,
    antialias: false,
    canvas: sceneCanvas,
    context: rendererContext,
    powerPreference: "high-performance",
  });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  renderer.setPixelRatio(window.devicePixelRatio);

  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs.add("CanvasViewBus"), cameraFrustumBus, physicsWorld, scheduler);
  const canvasViewBag = new CanvasViewBag(loggerBreadcrumbs.add("CanvasViewBag"), canvasViewBus);

  const loadingScreenController = new LoadingScreenController(
    loggerBreadcrumbs.add("LoadingScreen"),
    canvasControllerBus,
    canvasViewBag.fork(loggerBreadcrumbs.add("LoadingScreen")),
    loadingManager,
    renderer
  );

  await loadingManager.blocking(canvasControllerBus.add(cancelToken, loadingScreenController));

  const rootCanvasController = new RootCanvasController(
    loggerBreadcrumbs.add("RootCanvasController"),
    gameCamera,
    canvasControllerBus,
    canvasViewBag.fork(loggerBreadcrumbs.add("RootCanvasControllert")),
    keyboardState,
    loadingManager,
    logger,
    physicsWorld,
    pointerState,
    queryBus,
    renderer,
    scheduler,
    threeLoadingManager
  );

  await loadingManager.blocking(canvasControllerBus.add(cancelToken, rootCanvasController), "Loading initial game resources");

  logger.debug(loggerBreadcrumbs.add("attachRenderer"), "Game is ready.");

  // setTimeout(() => {
  //   cancelToken.cancel(loggerBreadcrumbs);
  // }, 100);

  await cancelToken.whenCanceled();

  // prevent some memory leaks
  renderer.dispose();
  sceneCanvas.remove();

  await loadingManager.blocking(canvasViewBag.dispose(cancelToken), "Disposing root canvas controller");
  await loadingManager.blocking(canvasControllerBus.delete(cancelToken, loadingScreenController));
  await loadingManager.blocking(canvasControllerBus.delete(cancelToken, rootCanvasController));

  canvasControllerBus.disconnect();
  keyboardState.disconnect();
  pointerState.disconnect();
  resizeObserver.disconnect();
  mainLoop.stop(mainLoopControlToken);

  if (SchedulerUpdateScenario.Always === busClock.useUpdate()) {
    scheduler.update.delete(busClock.update);
  }
  if (SchedulerUpdateScenario.Always === cameraFrustumBus.useUpdate()) {
    scheduler.update.delete(cameraFrustumBus.update);
  }
  if (SchedulerUpdateScenario.Always === physicsWorld.useUpdate()) {
    scheduler.update.delete(physicsWorld.update);
  }

  await logger.debug(loggerBreadcrumbs.add("attachRenderer"), "Game is completely disposed of.");
}
