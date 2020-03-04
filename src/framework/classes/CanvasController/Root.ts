import * as THREE from "three";
import autoBind from "auto-bind";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import env from "src/framework/helpers/env";

import CanvasController from "src/framework/classes/CanvasController";
import { default as PerspectiveCameraController } from "src/framework/classes/CanvasController/PerspectiveCamera";
import { default as PointerController } from "src/framework/classes/CanvasController/Pointer";
import { default as QuakeMapView } from "src/framework/classes/CanvasView/QuakeMap";

import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasControllerBus from "src/framework/interfaces/CanvasControllerBus";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import ElementSize from "src/framework/interfaces/ElementSize";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import KeyboardState from "src/framework/interfaces/KeyboardState";
import LoadingManager from "src/framework/interfaces/LoadingManager";
import Logger from "src/framework/interfaces/Logger";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import PointerState from "src/framework/interfaces/PointerState";
import QueryBus from "src/framework/interfaces/QueryBus";
import Scheduler from "src/framework/interfaces/Scheduler";
import { default as IPerspectiveCameraController } from "src/framework/interfaces/CanvasController/PerspectiveCamera";
import { default as IPointerController } from "src/framework/interfaces/CanvasController/Pointer";

// import { default as THREEHelpersView } from "src/framework/classes/CanvasView/THREEHelpers";

export default class Root extends CanvasController implements HasLoggerBreadcrumbs {
  readonly audioListener: THREE.AudioListener = new THREE.AudioListener();
  readonly audioLoader: THREE.AudioLoader;
  readonly canvasControllerBus: CanvasControllerBus;
  readonly gameCamera: THREE.PerspectiveCamera;
  readonly gameCameraController: IPerspectiveCameraController;
  readonly gameEffectComposer: EffectComposer;
  readonly gameGroup: THREE.Group = new THREE.Group();
  readonly gameScene: THREE.Scene = new THREE.Scene();
  readonly keyboardState: KeyboardState;
  readonly loadingManager: LoadingManager;
  // readonly loadingScreenController: ILoadingScreenController;
  readonly logger: Logger;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly outlinePass: OutlinePass;
  readonly pointerController: IPointerController;
  readonly pointerState: PointerState;
  readonly queryBus: QueryBus;
  readonly renderer: THREE.WebGLRenderer;
  readonly scheduler: Scheduler;
  readonly threeLoadingManager: THREE.LoadingManager;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    gameCamera: THREE.PerspectiveCamera,
    canvasControllerBus: CanvasControllerBus,
    canvasViewBag: CanvasViewBag,
    keyboardState: KeyboardState,
    loadingManager: LoadingManager,
    logger: Logger,
    pointerState: PointerState,
    queryBus: QueryBus,
    renderer: THREE.WebGLRenderer,
    scheduler: Scheduler,
    threeLoadingManager: THREE.LoadingManager
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.audioLoader = new THREE.AudioLoader(threeLoadingManager);
    this.gameCamera = gameCamera;

    // this.gameCamera.add(this.audioListener);

    this.canvasControllerBus = canvasControllerBus;
    this.keyboardState = keyboardState;
    this.loadingManager = loadingManager;
    this.logger = logger;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.outlinePass = new OutlinePass(new THREE.Vector2(1, 1), this.gameScene, this.gameCamera);
    this.queryBus = queryBus;
    this.pointerState = pointerState;
    this.renderer = renderer;
    this.scheduler = scheduler;

    const gameSceneBackgroundColor = 0x000000;

    this.gameScene.matrixAutoUpdate = false;
    this.gameScene.background = new THREE.Color(gameSceneBackgroundColor);
    this.gameScene.fog = new THREE.Fog(gameSceneBackgroundColor, 1024, 1024 * 3);
    this.gameScene.add(this.gameGroup);

    this.gameCameraController = new PerspectiveCameraController(loggerBreadcrumbs.add("Camera"), canvasViewBag.fork(loggerBreadcrumbs.add("Camera")), this.gameCamera);

    this.pointerController = new PointerController(
      loggerBreadcrumbs.add("Pointer"),
      this.gameGroup,
      canvasViewBag.fork(loggerBreadcrumbs.add("Pointer")),
      this.gameCameraController,
      renderer.domElement,
      loadingManager,
      pointerState,
      this.queryBus,
      scheduler,
      threeLoadingManager
    );

    this.threeLoadingManager = threeLoadingManager;

    this.gameEffectComposer = new EffectComposer(renderer);
    this.gameEffectComposer.addPass(new RenderPass(this.gameScene, this.gameCamera));
    this.gameEffectComposer.addPass(this.outlinePass);
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    await this.canvasControllerBus.add(cancelToken, this.gameCameraController);
    await this.canvasControllerBus.add(cancelToken, this.pointerController);

    await this.loadingManager.blocking(
      this.canvasViewBag.add(
        cancelToken,
        new QuakeMapView(
          this.loggerBreadcrumbs.add("QuakeMap"),
          this.gameCameraController,
          this.canvasControllerBus,
          this.canvasViewBag.fork(this.loggerBreadcrumbs.add("QuakeMap")),
          this.gameGroup,
          this.audioListener,
          this.audioLoader,
          this.loadingManager,
          this.logger,
          this.pointerController,
          this.pointerState,
          this.queryBus,
          this.threeLoadingManager,
          env(this.loggerBreadcrumbs.add("env"), "REACT_APP_PUBLIC_URL") + env(this.loggerBreadcrumbs.add("env"), "REACT_APP_MAP_OVERRIDE", "/maps/map-desert-hut.map")
          // env(this.loggerBreadcrumbs.add("env"), "REACT_APP_PUBLIC_URL") + env(this.loggerBreadcrumbs.add("env"), "REACT_APP_MAP_OVERRIDE", "/maps/map-cube-chipped.map")
        )
      ),
      "Loading map"
    );
    // await this.loadingManager.blocking(
    //   this.canvasViewBag.add(
    //     cancelToken,
    //     new THREEHelpersView(
    //       this.loggerBreadcrumbs.add("THREEHelpers"),
    //       this.canvasViewBag.fork(this.loggerBreadcrumbs.add("THREEHelpers")),
    //       this.gameGroup,
    //     )
    //   ),
    //   "Loading map helpers"
    // );
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    await this.canvasControllerBus.delete(cancelToken, this.gameCameraController);
    await this.canvasControllerBus.add(cancelToken, this.pointerController);

    this.gameScene.dispose();
  }

  draw(delta: number): void {
    if (this.loadingManager.isBlocking()) {
      return;
    }

    this.gameEffectComposer.render(delta);
  }

  resize(elementSize: ElementSize<ElementPositionUnit.Px>): void {
    const height = elementSize.getHeight();
    const width = elementSize.getWidth();

    this.renderer.setSize(width, height);

    this.gameEffectComposer.setSize(width, height);
  }

  useDraw(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
