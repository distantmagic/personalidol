// @flow

import autoBind from "auto-bind";

import BusClock from "./BusClock";
import CancelToken from "./CancelToken";
import ClockReactiveController from "./ClockReactiveController";
import EventListenerSet from "./EventListenerSet";
import Exception from "./Exception";
import ExpressionBus from "./ExpressionBus";
import ExpressionContext from "./ExpressionContext";
import KeyboardState from "./KeyboardState";
import MainLoop from "./MainLoop";
import PointerStateDelegate from "./PointerStateDelegate";
import QueryBus from "./QueryBus";
import SceneLoader from "./SceneLoader";
import SceneManager from "./SceneManager";
import Scheduler from "./Scheduler";
import THREELoadingManager from "./THREELoadingManager";

import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { CanvasController } from "../interfaces/CanvasController";
import type { ClockReactiveController as ClockReactiveControllerInterface } from "../interfaces/ClockReactiveController";
import type { Debugger } from "../interfaces/Debugger";
import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { ExpressionBus as ExpressionBusInterface } from "../interfaces/ExpressionBus";
import type { ExpressionContext as ExpressionContextInterface } from "../interfaces/ExpressionContext";
import type { Game as GameInterface } from "../interfaces/Game";
import type { KeyboardState as KeyboardStateInterface } from "../interfaces/KeyboardState";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { MainLoop as MainLoopInterface } from "../interfaces/MainLoop";
import type { PointerState as PointerStateInterface } from "../interfaces/PointerState";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";
import type { SceneLoader as SceneLoaderInterface } from "../interfaces/SceneLoader";
import type { SceneManager as SceneManagerInterface } from "../interfaces/SceneManager";
import type { SceneManagerChangeCallback } from "../types/SceneManagerChangeCallback";
import type { Scheduler as SchedulerInterface } from "../interfaces/Scheduler";
import type { THREELoadingManager as THREELoadingManagerInterface } from "../interfaces/THREELoadingManager";

async function onSceneStateChange(
  loggerBreadcrumbs: LoggerBreadcrumbs,
  canvas: ?HTMLCanvasElement,
  sceneManager: ?SceneManagerInterface
): Promise<void> {
  if (!canvas || !sceneManager) {
    return;
  }

  const cancelToken = new CancelToken(loggerBreadcrumbs.add("onSceneStateChange"));

  if (sceneManager.isAttached()) {
    await sceneManager.detach(cancelToken);
  }

  sceneManager.attach(cancelToken, canvas);
}

export default class Game implements GameInterface {
  +clockReactiveController: ClockReactiveControllerInterface;
  +debug: Debugger;
  +exceptionHandler: ExceptionHandler;
  +expressionBus: ExpressionBusInterface;
  +expressionContext: ExpressionContextInterface;
  +keyboardState: KeyboardStateInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mainLoop: MainLoopInterface;
  +pointerState: PointerStateInterface;
  +queryBus: QueryBusInterface;
  +sceneManagerChangeCallbacks: EventListenerSetInterface<[SceneManagerInterface]>;
  +scheduler: SchedulerInterface;
  +threeLoadingManager: THREELoadingManagerInterface;
  canvas: ?HTMLCanvasElement;
  sceneLoader: ?SceneLoaderInterface;
  sceneManager: ?SceneManagerInterface;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, debug: Debugger, exceptionHandler: ExceptionHandler) {
    autoBind(this);

    this.canvas = null;
    this.debug = debug;
    this.exceptionHandler = exceptionHandler;
    this.expressionBus = new ExpressionBus();
    this.expressionContext = new ExpressionContext(loggerBreadcrumbs.add("ExpressionContext"));
    this.keyboardState = new KeyboardState();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.pointerState = new PointerStateDelegate(loggerBreadcrumbs.add("PointerStateDelegate"));
    this.queryBus = new QueryBus(loggerBreadcrumbs.add("QueryBus"));
    this.clockReactiveController = new ClockReactiveController(new BusClock(), [
      this.queryBus
    ]);
    this.sceneLoader = null;
    this.sceneManager = null;
    this.sceneManagerChangeCallbacks = new EventListenerSet<[SceneManagerInterface]>();
    this.scheduler = new Scheduler();
    this.threeLoadingManager = new THREELoadingManager(loggerBreadcrumbs.add("THREELoadingManager"), exceptionHandler);

    this.mainLoop = MainLoop.getInstance();
    this.mainLoop.attachScheduler(this.scheduler);
  }

  getExceptionHandler(): ExceptionHandler {
    return this.exceptionHandler;
  }

  getExpressionBus(): ExpressionBusInterface {
    return this.expressionBus;
  }

  getExpressionContext(): ExpressionContextInterface {
    return this.expressionContext;
  }

  getKeyboardState(): KeyboardStateInterface {
    return this.keyboardState;
  }

  getMainLoop(): MainLoopInterface {
    return this.mainLoop;
  }

  getPointerState(): PointerStateInterface {
    return this.pointerState;
  }

  getQueryBus(): QueryBusInterface {
    return this.queryBus;
  }

  getSceneManager(): SceneManagerInterface {
    const sceneManager = this.sceneManager;

    if (!sceneManager) {
      throw new Exception(this.loggerBreadcrumbs, "Scene manager is not set but it was expected.");
    }

    return sceneManager;
  }

  getScheduler(): SchedulerInterface {
    return this.scheduler;
  }

  getTHREELoadingManager(): THREELoadingManagerInterface {
    return this.threeLoadingManager;
  }

  hasSceneManager(): boolean {
    return !!this.sceneManager;
  }

  offSceneManagerChange(callback: SceneManagerChangeCallback): void {
    this.sceneManagerChangeCallbacks.delete(callback);
  }

  onSceneManagerChange(callback: SceneManagerChangeCallback): void {
    this.sceneManagerChangeCallbacks.add(callback);
  }

  async run(cancelToken: CancelTokenInterface): Promise<void> {
    this.keyboardState.observe();
    this.pointerState.observe();
    this.clockReactiveController.interval(cancelToken);
    // this.keyboardState.disconnect();
    // this.pointerState.disconnect();
  }

  setExpectedFPS(expectedFPS: number): void {
    this.mainLoop.setMaxAllowedFPS(expectedFPS);
  }

  async setPrimaryController(controller: CanvasController): Promise<void> {
    const sceneManager = new SceneManager(
      this.loggerBreadcrumbs.add("SceneManager"),
      this.getExceptionHandler(),
      this.getScheduler(),
      controller
    );
    const sceneLoader = new SceneLoader(
      this.loggerBreadcrumbs.add("SceneLoader"),
      this.getExceptionHandler(),
      sceneManager,
      this.getTHREELoadingManager()
    );

    const previousSceneManager = this.sceneManager;
    const previousSceneLoader = this.sceneLoader;

    if (previousSceneManager) {
      const cancelToken = new CancelToken(this.loggerBreadcrumbs.add("setPrimaryController"));

      await previousSceneManager.detach(cancelToken);
    }

    if (previousSceneLoader) {
      previousSceneLoader.disconnect();
    }

    this.sceneManager = sceneManager;
    this.sceneLoader = sceneLoader;

    this.sceneManagerChangeCallbacks.notify([sceneManager]);

    sceneLoader.observe();
    onSceneStateChange(this.loggerBreadcrumbs, this.canvas, this.sceneManager);
  }
}
