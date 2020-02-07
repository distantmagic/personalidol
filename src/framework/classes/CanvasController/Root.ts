import * as THREE from "three";
import autoBind from "auto-bind";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import env from "src/framework/helpers/env";

import CanvasController from "src/framework/classes/CanvasController";
import { default as CameraController } from "src/framework/classes/CanvasController/Camera";
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
import { default as ICameraController } from "src/framework/interfaces/CanvasController/Camera";
import { default as IPointerController } from "src/framework/interfaces/CanvasController/Pointer";

// import { default as THREEHelpersView } from "src/framework/classes/CanvasView/THREEHelpers";

export default class Root extends CanvasController implements HasLoggerBreadcrumbs {
  readonly audioListener: THREE.AudioListener = new THREE.AudioListener();
  readonly audioLoader: THREE.AudioLoader;
  readonly camera: THREE.PerspectiveCamera;
  readonly cameraController: ICameraController;
  readonly canvasControllerBus: CanvasControllerBus;
  readonly canvasRootGroup: THREE.Group = new THREE.Group();
  readonly effectComposer: EffectComposer;
  readonly keyboardState: KeyboardState;
  readonly loadingManager: LoadingManager;
  readonly logger: Logger;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly outlinePass: OutlinePass;
  readonly pointerController: IPointerController;
  readonly pointerState: PointerState;
  readonly queryBus: QueryBus;
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene = new THREE.Scene();
  readonly scheduler: Scheduler;
  readonly threeLoadingManager: THREE.LoadingManager;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    camera: THREE.PerspectiveCamera,
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
    this.camera = camera;

    // this.camera.add(this.audioListener);

    this.canvasControllerBus = canvasControllerBus;
    this.keyboardState = keyboardState;
    this.loadingManager = loadingManager;
    this.logger = logger;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.outlinePass = new OutlinePass(new THREE.Vector2(1, 1), this.scene, this.camera);
    this.queryBus = queryBus;
    this.pointerState = pointerState;
    this.renderer = renderer;
    this.scheduler = scheduler;

    this.scene.matrixAutoUpdate = false;

    const sceneBackgroundColor = 0x000000;

    this.scene.background = new THREE.Color(sceneBackgroundColor);
    // this.scene.fog = new THREE.Fog(sceneBackgroundColor, 512, 1024 * 3);

    this.scene.add(this.canvasRootGroup);

    this.cameraController = new CameraController(loggerBreadcrumbs.add("CameraController"), canvasViewBag, this.camera);
    this.pointerController = new PointerController(
      loggerBreadcrumbs.add("PointerController"),
      this.canvasRootGroup,
      canvasViewBag,
      this.cameraController,
      renderer.domElement,
      loadingManager,
      pointerState,
      this.queryBus,
      scheduler,
      threeLoadingManager
    );

    this.threeLoadingManager = threeLoadingManager;

    this.effectComposer = new EffectComposer(renderer);
    this.effectComposer.addPass(new RenderPass(this.scene, this.camera));
    this.effectComposer.addPass(this.outlinePass);
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    await this.canvasControllerBus.add(cancelToken, this.cameraController);
    await this.canvasControllerBus.add(cancelToken, this.pointerController);

    await this.loadingManager.blocking(
      this.canvasViewBag.add(
        cancelToken,
        new QuakeMapView(
          this.loggerBreadcrumbs.add("QuakeMap"),
          this.cameraController,
          this.canvasControllerBus,
          this.canvasViewBag.fork(this.loggerBreadcrumbs.add("QuakeMap")),
          this.canvasRootGroup,
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
    //       this.canvasRootGroup,
    //     )
    //   ),
    //   "Loading map helpers"
    // );
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    await this.canvasControllerBus.delete(cancelToken, this.cameraController);

    this.scene.dispose();
  }

  draw(interpolationPercentage: number): void {
    super.draw(interpolationPercentage);

    this.effectComposer.render();
  }

  resize(elementSize: ElementSize<ElementPositionUnit.Px>): void {
    super.resize(elementSize);

    const height = elementSize.getHeight();
    const width = elementSize.getWidth();

    this.renderer.setSize(width, height);

    this.effectComposer.setSize(width, height);
  }

  useDraw(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
