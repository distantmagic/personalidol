import * as THREE from "three";
import autoBind from "auto-bind";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import CanvasController from "src/framework/classes/CanvasController";
import { default as LoadingScreenView } from "src/framework/classes/CanvasView/LoadingScreen";
import { default as PerspectiveCameraController } from "src/framework/classes/CanvasController/PerspectiveCamera";

import cancelable from "src/framework/decorators/cancelable";

import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasControllerBus from "src/framework/interfaces/CanvasControllerBus";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type ElementSize from "src/framework/interfaces/ElementSize";
import type LoadingManager from "src/framework/interfaces/LoadingManager";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as ILoadingScreenView } from "src/framework/interfaces/CanvasView/LoadingScreen";
import type { default as IPerspectiveCameraController } from "src/framework/interfaces/CanvasController/PerspectiveCamera";

export default class LoadingScreen extends CanvasController {
  readonly canvasControllerBus: CanvasControllerBus;
  readonly loaderCamera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(1, 1, 1, 1);
  readonly loaderCameraController: IPerspectiveCameraController;
  readonly loaderEffectComposer: EffectComposer;
  readonly loaderGroup: THREE.Group = new THREE.Group();
  readonly loaderScene: THREE.Scene = new THREE.Scene();
  readonly loadingManager: LoadingManager;
  readonly loadingScreenView: ILoadingScreenView;
  readonly renderer: THREE.WebGLRenderer;
  private progress: number = 0;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    canvasControllerBus: CanvasControllerBus,
    canvasViewBag: CanvasViewBag,
    loadingManager: LoadingManager,
    renderer: THREE.WebGLRenderer
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.canvasControllerBus = canvasControllerBus;
    this.loadingManager = loadingManager;
    this.renderer = renderer;

    this.loaderScene.matrixAutoUpdate = false;
    this.loaderScene.add(this.loaderGroup);

    this.loaderCameraController = new PerspectiveCameraController(
      loggerBreadcrumbs.add("PerspectiveCamera"),
      canvasViewBag.fork(loggerBreadcrumbs.add("PerspectiveCamera")),
      this.loaderCamera
    );

    this.loaderEffectComposer = new EffectComposer(renderer);
    this.loaderEffectComposer.addPass(new RenderPass(this.loaderScene, this.loaderCamera));

    this.loadingScreenView = new LoadingScreenView(loggerBreadcrumbs.add("LoadingScreen"), canvasViewBag.fork(loggerBreadcrumbs.add("LoadingScreen")), this.loaderGroup);
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    await this.canvasControllerBus.add(cancelToken, this.loaderCameraController);
    await this.canvasViewBag.add(cancelToken, this.loadingScreenView);

    this.loaderCameraController.camera.position.set(0, 512, 0);
    this.loaderCameraController.camera.lookAt(new THREE.Vector3(0, 0, 0));
    // this.loaderCameraController.setZoom(0.1);
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    await this.canvasControllerBus.delete(cancelToken, this.loaderCameraController);

    this.loaderScene.dispose();
  }

  draw(delta: number): void {
    if (!this.loadingManager.isBlocking()) {
      return;
    }

    this.loaderEffectComposer.render(delta);
  }

  resize(elementSize: ElementSize<ElementPositionUnit.Px>): void {
    const height = elementSize.getHeight();
    const width = elementSize.getWidth();

    this.loaderEffectComposer.setSize(width, height);
  }

  update(delta: number): void {
    const currentProgress = this.loadingManager.getProgress();

    // something was added to the loading queue while loading, do not go down
    this.progress = Math.max(this.progress, currentProgress);

    this.loadingScreenView.setProgress(this.progress);

    // const cameraPosition = new THREE.Vector3(0, (1 / this.progress) * 1024, 0);
    // this.loaderCameraController.camera.position.copy(cameraPosition);
    // this.loaderCameraController.setZoom(this.progress * 1);
  }

  useDraw(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
