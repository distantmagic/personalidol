// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import CanvasController from "../CanvasController";
import CanvasPointerController from "../CanvasPointerController";
import ElementSize from "../ElementSize";
import PointerEventResponder from "../CanvasPointerResponder/PointerEventResponder";
import THREEPointerInteraction from "../THREEPointerInteraction";
import { default as CameraController } from "./Camera";
import { default as QuakeMapView } from "../CanvasView/QuakeMap";

import type { EffectComposer as EffectComposerInterface } from "three/examples/jsm/postprocessing/EffectComposer";
import type { LoadingManager as THREELoadingManager, OrthographicCamera, Scene, WebGLRenderer } from "three";

import type { CameraController as CameraControllerInterface } from "../../interfaces/CameraController";
import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasControllerBus } from "../../interfaces/CanvasControllerBus";
import type { CanvasPointerController as CanvasPointerControllerInterface } from "../../interfaces/CanvasPointerController";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { Debugger } from "../../interfaces/Debugger";
import type { ElementSize as ElementSizeInterface } from "../../interfaces/ElementSize";
import type { KeyboardState } from "../../interfaces/KeyboardState";
import type { LoadingManager } from "../../interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { PointerState } from "../../interfaces/PointerState";
import type { QueryBus } from "../../interfaces/QueryBus";
import type { Scheduler } from "../../interfaces/Scheduler";
import type { THREEPointerInteraction as THREEPointerInteractionInterface } from "../../interfaces/THREEPointerInteraction";

export default class Root extends CanvasController {
  +camera: OrthographicCamera;
  +cameraController: CameraControllerInterface;
  +canvasControllerBus: CanvasControllerBus;
  +canvasPointerController: CanvasPointerControllerInterface;
  +debug: Debugger;
  +effectComposer: EffectComposerInterface;
  +keyboardState: KeyboardState;
  +loadingManager: LoadingManager;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;
  +renderer: WebGLRenderer;
  +scene: Scene;
  +scheduler: Scheduler;
  +threeLoadingManager: THREELoadingManager;
  +threePointerInteraction: THREEPointerInteractionInterface;

  constructor(
    canvasControllerBus: CanvasControllerBus,
    canvasViewBag: CanvasViewBag,
    debug: Debugger,
    keyboardState: KeyboardState,
    loadingManager: LoadingManager,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    pointerState: PointerState,
    queryBus: QueryBus,
    renderer: WebGLRenderer,
    scheduler: Scheduler,
    threeLoadingManager: THREELoadingManager
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.camera = new THREE.OrthographicCamera();
    this.canvasControllerBus = canvasControllerBus;
    this.debug = debug;
    this.keyboardState = keyboardState;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.queryBus = queryBus;
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    // this.scene.fog = new THREE.Fog(0x000000, 256, 1024);

    this.scheduler = scheduler;
    this.cameraController = new CameraController(canvasViewBag, this.camera, debug, loggerBreadcrumbs, renderer, this.scene, new ElementSize<"px">(0, 0));
    this.threeLoadingManager = threeLoadingManager;
    this.threePointerInteraction = new THREEPointerInteraction(renderer, this.camera);

    const renderPass = new RenderPass(this.scene, this.camera);

    this.effectComposer = new EffectComposer(renderer);
    this.effectComposer.addPass(renderPass);

    this.canvasPointerController = new CanvasPointerController(this.threePointerInteraction.getCameraRaycaster(), this.scene);
    this.canvasPointerController.addResponder(new PointerEventResponder(pointerState));
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    await this.canvasControllerBus.add(cancelToken, this.cameraController);
    await this.loadingManager.blocking(
      this.canvasViewBag.add(
        cancelToken,
        new QuakeMapView(
          this.canvasViewBag.fork(this.loggerBreadcrumbs.add("QuakeMap")),
          this.loadingManager,
          this.loggerBreadcrumbs.add("QuakeMap"),
          this.queryBus,
          this.scene,
          this.threeLoadingManager,
          "/assets/map-desert-hut.map"
        )
      ),
      "Loading map"
    );
    this.scene.add(new THREE.AxesHelper(256));

    this.scheduler.onBegin(this.canvasPointerController.begin);
    this.scheduler.onUpdate(this.threePointerInteraction.update);
    this.threePointerInteraction.observe();
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    await this.canvasControllerBus.delete(cancelToken, this.cameraController);

    this.scheduler.offBegin(this.canvasPointerController.begin);
    this.scheduler.offUpdate(this.threePointerInteraction.update);

    this.threePointerInteraction.disconnect();
    this.scene.dispose();
    this.debug.deleteState(this.loggerBreadcrumbs.add("fps"));
  }

  draw(interpolationPercentage: number): void {
    super.draw(interpolationPercentage);

    this.effectComposer.render();
  }

  end(fps: number, isPanicked: boolean): void {
    super.end(fps, isPanicked);

    this.debug.updateState(this.loggerBreadcrumbs.add("fps"), fps);
  }

  resize(elementSize: ElementSizeInterface<"px">): void {
    super.resize(elementSize);

    const height = elementSize.getHeight();
    const width = elementSize.getWidth();

    this.effectComposer.setSize(width, height);
    this.renderer.setSize(width, height);
    this.threePointerInteraction.resize(elementSize);
  }
}
