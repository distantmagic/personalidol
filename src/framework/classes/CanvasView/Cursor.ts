import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "src/framework/classes/CanvasView";
import { default as GLTFModelQuery } from "src/framework/classes/Query/GLTFModel";

import cancelable from "src/framework/decorators/cancelable";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type LoadingManager from "src/framework/interfaces/LoadingManager";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type PointerState from "src/framework/interfaces/PointerState";
import type QueryBus from "src/framework/interfaces/QueryBus";
import type { default as ICursorCanvasView } from "src/framework/interfaces/CanvasView/Cursor";
import type { default as IPerspectiveCameraController } from "src/framework/interfaces/CanvasController/PerspectiveCamera";

const SPEED = 5;

export default class Cursor extends CanvasView implements ICursorCanvasView {
  readonly gameCameraController: IPerspectiveCameraController;
  readonly loadingManager: LoadingManager;
  readonly pointerState: PointerState;
  readonly queryBus: QueryBus;
  private cursorGroup: THREE.Group = new THREE.Group();
  private scale: number = 1;
  private spotLight: THREE.SpotLight = new THREE.SpotLight();
  private threeLoadingManager: THREE.LoadingManager;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    gameCameraController: IPerspectiveCameraController,
    canvasViewBag: CanvasViewBag,
    loadingManager: LoadingManager,
    group: THREE.Group,
    pointerState: PointerState,
    queryBus: QueryBus,
    threeLoadingManager: THREE.LoadingManager
  ) {
    super(loggerBreadcrumbs, canvasViewBag, group);
    autoBind(this);

    this.gameCameraController = gameCameraController;
    this.loadingManager = loadingManager;
    this.pointerState = pointerState;
    this.queryBus = queryBus;
    this.threeLoadingManager = threeLoadingManager;
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const modelQuery = new GLTFModelQuery(this.threeLoadingManager, "/models/model-glb-cursor/", `/models/model-glb-cursor/model.glb`);
    const response = await this.queryBus.enqueue(cancelToken, modelQuery).whenExecuted();

    for (let child of response.scene.children) {
      if (child instanceof THREE.Mesh) {
        const material = child.material;

        if (material instanceof THREE.MeshStandardMaterial) {
          child.castShadow = true;
          child.renderOrder = 1;

          material.emissive = new THREE.Color("white");
          material.emissiveIntensity = 0.1;
          material.fog = false;
          material.depthTest = false;
        }
      }
    }

    this.children.add(response.scene);
    this.gameCameraController.onZoomChange.add(this.onZoomChange);

    this.cursorGroup = response.scene;

    const light = new THREE.SpotLight();

    light.angle = Math.PI / 2;
    light.intensity = 0.2;
    light.position.set(8, 48, -8);
    light.penumbra = 1;
    light.target = new THREE.Object3D();
    light.target.position.set(8, 0, -8);

    this.children.add(light);
    this.children.add(light.target);

    this.spotLight = light;

    this.onZoomChange(this.gameCameraController.getZoom());
    this.setVisible(false);
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.gameCameraController.onZoomChange.delete(this.onZoomChange);
  }

  onZoomChange(zoom: number): void {
    // const scale = 1 / zoom;
    const scale = 1 / 4;

    this.children.scale.set(scale, scale, scale);
    this.scale = scale;
  }

  setPosition(x: number, y: number, z: number): void {
    this.children.position.set(x + this.scale * 32, y + this.scale * 48, z + this.scale * 32);
  }

  setVisible(isVisible: boolean): void {
    this.cursorGroup.visible = isVisible;

    // do not unset light via .visible to not recompile shaders
    // there might be a small lag while cursor is leaving the game area
    this.spotLight.intensity = isVisible ? 0.2 : 0;
  }

  update(delta: number): void {
    this.cursorGroup.rotation.x += delta * SPEED;
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
