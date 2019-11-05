// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasController from "../CanvasController";
import { default as TiledMapView } from "../CanvasView/TiledMap";

import type { OrthographicCamera, Scene, WebGLRenderer } from "three";

import type { CanvasControllerBus } from "../../interfaces/CanvasControllerBus";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { Debugger } from "../../interfaces/Debugger";
import type { ElementSize } from "../../interfaces/ElementSize";
import type { KeyboardState } from "../../interfaces/KeyboardState";
import type { LoadingManager } from "../../interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { PointerState } from "../../interfaces/PointerState";
import type { QueryBus } from "../../interfaces/QueryBus";
import type { THREELoadingManager } from "../../interfaces/THREELoadingManager";

const CAMERA_FOV = 90;

export default class Root extends CanvasController {
  +camera: OrthographicCamera;
  +canvasControllerBus: CanvasControllerBus;
  +debug: Debugger;
  +keyboardState: KeyboardState;
  +loadingManager: LoadingManager;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +pointerState: PointerState;
  +queryBus: QueryBus;
  +renderer: WebGLRenderer;
  +scene: Scene;
  +threeLoadingManager: THREELoadingManager;

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
    threeLoadingManager: THREELoadingManager
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.camera = new THREE.OrthographicCamera(CAMERA_FOV, 0, 0.1, 1000);
    this.canvasControllerBus = canvasControllerBus;
    this.debug = debug;
    this.keyboardState = keyboardState;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.pointerState = pointerState;
    this.queryBus = queryBus;
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(): Promise<void> {
    await super.attach();

    await this.loadingManager.blocking(
      this.canvasViewBag.add(
        new TiledMapView(
          this.canvasViewBag.fork(this.loggerBreadcrumbs.add("TiledMapView")),
          this.debug,
          this.loadingManager,
          this.loggerBreadcrumbs.add("TiledMapView"),
          this.queryBus,
          this.scene,
          this.threeLoadingManager
        )
      ),
      "Loading map"
    );

    this.camera.position.set(16, 16, 16);
    this.camera.lookAt(this.scene.position);
    this.debug.updateState(this.loggerBreadcrumbs.add("camera").add("position"), this.camera.position);
  }

  async dispose(): Promise<void> {
    await super.dispose();

    // redraw once more after cleaning views etc
    this.draw(0);

    this.scene.dispose();
    this.debug.deleteState(this.loggerBreadcrumbs.add("camera").add("position"));
  }

  draw(interpolationPercentage: number): void {
    super.draw(interpolationPercentage);

    this.renderer.render(this.scene, this.camera);
  }

  resize(elementSize: ElementSize<"px">): void {
    super.resize(elementSize);

    const height = elementSize.getHeight();
    const width = elementSize.getWidth();
    const zoom = 160;

    this.camera.left = -1 * (width / zoom);
    this.camera.far = 100;
    this.camera.near = 0;
    this.camera.right = width / zoom;
    this.camera.top = height / zoom;
    this.camera.bottom = -1 * (height / zoom);
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
