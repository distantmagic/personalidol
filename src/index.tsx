import * as THREE from "three";
import yn from "yn";

import env from "src/framework/helpers/env";

import BusClock from "src/framework/classes/BusClock";
import CancelToken from "src/framework/classes/CancelToken";
import CanvasControllerBus from "src/framework/classes/CanvasControllerBus";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import ClockReactiveController from "src/framework/classes/ClockReactiveController";
import Debugger from "src/framework/classes/Debugger";
import ExceptionHandler from "src/framework/classes/ExceptionHandler";
import HTMLElementPositionObserver from "src/framework/classes/HTMLElementPositionObserver";
import HTMLElementSize from "src/framework/classes/HTMLElementSize";
import HTMLElementSizeObserver from "src/framework/classes/HTMLElementSizeObserver";
import KeyboardState from "src/framework/classes/KeyboardState";
import LoadingManager from "src/framework/classes/LoadingManager";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import MainLoop from "src/framework/classes/MainLoop";
import PointerState from "src/framework/classes/PointerState";
import QueryBus from "src/framework/classes/QueryBus";
import Scheduler from "src/framework/classes/Scheduler";
import { default as ConsoleLogger } from "src/framework/classes/Logger/Console";
import { default as RootCanvasController } from "src/framework/classes/CanvasController/Root";
import { default as UnexpectedExceptionHandlerFilter } from "src/framework/classes/ExceptionHandlerFilter/Unexpected";

// import * as serviceWorker from "src/serviceWorker";

const rootElement = document.getElementById("dd-root");

if (!rootElement) {
  throw new Error("Root element not found.");
}

if (!(rootElement instanceof HTMLCanvasElement)) {
  throw new Error("Root element is not a canvas.");
}

const loggerBreadcrumbs = new LoggerBreadcrumbs(["worker"]);
const logger = new ConsoleLogger();
const cancelToken = new CancelToken(loggerBreadcrumbs.add("CancelToken"));
const debug = new Debugger(loggerBreadcrumbs);
const exceptionHandlerFilter = new UnexpectedExceptionHandlerFilter();
const exceptionHandler = new ExceptionHandler(logger, exceptionHandlerFilter);
const queryBus = new QueryBus(exceptionHandler, loggerBreadcrumbs.add("QueryBus"));
const clockReactiveController = new ClockReactiveController(new BusClock(), queryBus);
const loadingManager = new LoadingManager(loggerBreadcrumbs.add("LoadingManager"), exceptionHandler);
const threeLoadingManager = new THREE.LoadingManager();

const scheduler = new Scheduler(loggerBreadcrumbs.add("Scheduler"));
const keyboardState = new KeyboardState(loggerBreadcrumbs.add("KeyboardState"));
const mainLoop = MainLoop.getInstance(loggerBreadcrumbs.add("MainLoop"));
const mainLoopControlToken = mainLoop.getControllable().obtainControlToken();

// mainLoop.setMaxAllowedFPS(80);
mainLoop.attachScheduler(scheduler);

clockReactiveController.interval(cancelToken);

debug.setIsEnabled(
  yn(env(loggerBreadcrumbs, "REACT_APP_FEATURE_DEBUGGER", ""), {
    default: false,
  })
);

window.addEventListener("beforeunload", function() {
  cancelToken.cancel(loggerBreadcrumbs.add("beforeunload"));
});

bootstrap(rootElement);

async function bootstrap(sceneCanvas: HTMLCanvasElement) {
  const positionObserver = new HTMLElementPositionObserver(loggerBreadcrumbs.add("HTMLElementPositionObserver"), sceneCanvas);
  const pointerState = new PointerState(loggerBreadcrumbs.add("PointerState"), sceneCanvas);
  const resizeObserver = new HTMLElementSizeObserver(loggerBreadcrumbs.add("HTMLElementSizeObserver"), sceneCanvas);
  const canvasControllerBus = new CanvasControllerBus(loggerBreadcrumbs, positionObserver, resizeObserver, scheduler);

  canvasControllerBus.observe();
  keyboardState.observe();
  pointerState.observe();
  positionObserver.observe();
  resizeObserver.observe();
  mainLoop.start(mainLoopControlToken);

  function onWindowResize() {
    sceneCanvas.style.height = `${window.innerHeight}px`;
    sceneCanvas.style.width = `${window.innerWidth}px`;
  }

  window.addEventListener("resize", onWindowResize);

  const resizeInterval = setInterval(onWindowResize, 100);

  const renderer = new THREE.WebGLRenderer({
    alpha: false,
    antialias: false,
    canvas: sceneCanvas,
  });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  renderer.setPixelRatio(window.devicePixelRatio);

  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs.add("CanvasViewBus"), scheduler);
  const canvasViewBag = new CanvasViewBag(loggerBreadcrumbs.add("CanvasViewBag"), canvasViewBus);

  const canvasController = new RootCanvasController(
    loggerBreadcrumbs.add("RootCanvasController"),
    canvasControllerBus,
    canvasViewBag.fork(loggerBreadcrumbs.add("RootCanvasControllert")),
    debug,
    keyboardState,
    loadingManager,
    logger,
    pointerState,
    queryBus,
    renderer,
    scheduler,
    threeLoadingManager
  );

  await loadingManager.blocking(canvasControllerBus.add(cancelToken, canvasController), "Loading initial game resources");

  canvasController.resize(new HTMLElementSize(sceneCanvas));

  logger.debug(loggerBreadcrumbs.add("attachRenderer"), "Game is ready.");

  // setTimeout(() => {
  //   cancelToken.cancel(loggerBreadcrumbs);
  // }, 100);

  await cancelToken.whenCanceled();

  clearInterval(resizeInterval);

  // prevent some memory leaks
  renderer.dispose();
  renderer.forceContextLoss();
  sceneCanvas.remove();

  await loadingManager.blocking(canvasViewBag.dispose(cancelToken), "Disposing root canvas controller");
  await loadingManager.blocking(canvasControllerBus.delete(cancelToken, canvasController), "Disposing game resources");

  canvasControllerBus.disconnect();
  keyboardState.disconnect();
  pointerState.disconnect();
  positionObserver.disconnect();
  resizeObserver.disconnect();
  mainLoop.stop(mainLoopControlToken);

  await logger.debug(loggerBreadcrumbs.add("attachRenderer"), "Game is completely disposed of.");
}
