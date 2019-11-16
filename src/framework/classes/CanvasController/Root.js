// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import CameraController from "../CameraController";
import CanvasController from "../CanvasController";
import CanvasPointerController from "../CanvasPointerController";
import ElementSize from "../ElementSize";
import PointerEventResponder from "../CanvasPointerResponder/PointerEventResponder";
import THREEPointerInteraction from "../THREEPointerInteraction";
import { default as AmbientLightView } from "../CanvasView/AmbientLight";
import { default as MD2CharacterView } from "../CanvasView/MD2Character";
import { default as QuakeMapView } from "../CanvasView/QuakeMap";

import type { EffectComposer as EffectComposerInterface } from "three/examples/jsm/postprocessing/EffectComposer";
import type { LoadingManager as THREELoadingManager, OrthographicCamera, Scene, WebGLRenderer } from "three";
// import type { ShaderPass as ShaderPassInterface } from "three/examples/jsm/postprocessing/ShaderPass";

import type { CameraController as CameraControllerInterface } from "../../interfaces/CameraController";
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
  // +shaderPass: ShaderPassInterface;
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
    // this.scene.fog = new THREE.Fog( 0x050505, 40, 100 );

    this.scheduler = scheduler;
    this.cameraController = new CameraController(
      this.camera,
      debug,
      loggerBreadcrumbs,
      renderer,
      this.scene,
      new ElementSize<"px">(0, 0)
    );
    this.threeLoadingManager = threeLoadingManager;
    this.threePointerInteraction = new THREEPointerInteraction(renderer, this.camera);

    const renderPass = new RenderPass(this.scene, this.camera);

    // this.shaderPass = new ShaderPass(FXAAShader);

    this.effectComposer = new EffectComposer(renderer);
    this.effectComposer.addPass(renderPass);
    // this.effectComposer.addPass(this.shaderPass);

    this.canvasPointerController = new CanvasPointerController(
      this.threePointerInteraction.getCameraRaycaster(),
      this.scene
    );
    this.canvasPointerController.addResponder(new PointerEventResponder(pointerState));
  }

  async attach(): Promise<void> {
    await super.attach();

    await Promise.all([
      this.cameraController.attach(),
      this.loadingManager.blocking(
        this.canvasViewBag.add(
          new AmbientLightView(
            this.canvasViewBag.fork(this.loggerBreadcrumbs.add("AmbientLight")),
            this.debug,
            this.loggerBreadcrumbs.add("AmbientLight"),
            this.scene
          )
        ),
        "Loading lights"
      ),
      this.loadingManager.blocking(
        this.canvasViewBag.add(
          new MD2CharacterView(
            this.canvasViewBag.fork(this.loggerBreadcrumbs.add("MD2Character")),
            this.scene,
            this.threeLoadingManager
          )
        ),
        "Loading character"
      ),
      this.loadingManager.blocking(
        this.canvasViewBag.add(
          new QuakeMapView(
            this.canvasViewBag.fork(this.loggerBreadcrumbs.add("QuakeMap")),
            this.scene,
            this.threeLoadingManager,
            "/assets/map-test.obj"
          )
        ),
        "Loading map"
      ),
    ]);

    this.scheduler.onBegin(this.canvasPointerController.begin);
    this.scheduler.onDraw(this.cameraController.draw);
    this.scheduler.onUpdate(this.threePointerInteraction.update);
    this.threePointerInteraction.observe();
  }

  async dispose(): Promise<void> {
    await super.dispose();

    this.scheduler.offBegin(this.canvasPointerController.begin);
    this.scheduler.offDraw(this.cameraController.draw);
    this.scheduler.offUpdate(this.threePointerInteraction.update);

    await this.cameraController.dispose();

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
    this.cameraController.setViewportSize(elementSize);
    this.threePointerInteraction.resize(elementSize);
    // this.shaderPass.uniforms["resolution"].value.set(1 / width, 1 / height);
  }
}
