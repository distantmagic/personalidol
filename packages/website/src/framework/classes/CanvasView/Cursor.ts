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
  private _cursorGroup: THREE.Group = new THREE.Group();
  private _threeLoadingManager: THREE.LoadingManager;

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
    this._threeLoadingManager = threeLoadingManager;
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const modelQuery = new GLTFModelQuery(this._threeLoadingManager, "/models/model-glb-cursor/", `/models/model-glb-cursor/model.glb`);
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
    this._cursorGroup = response.scene;

    this.setVisible(false);
  }

  setPosition(x: number, y: number, z: number): void {
    this.children.position.set(x, y, z);
  }

  setVisible(isVisible: boolean): void {
    this._cursorGroup.visible = isVisible;
  }

  update(delta: number): void {
    this._cursorGroup.rotation.x += delta * SPEED;
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
