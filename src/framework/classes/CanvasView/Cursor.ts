import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "src/framework/classes/CanvasView";
import { default as GLTFModelQuery } from "src/framework/classes/Query/GLTFModel";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import PointerState from "src/framework/interfaces/PointerState";
import QueryBus from "src/framework/interfaces/QueryBus";
import { default as ICameraController } from "src/framework/interfaces/CanvasController/Camera";
import { default as ICursorCanvasView } from "src/framework/interfaces/CanvasView/Cursor";

export default class Cursor extends CanvasView implements ICursorCanvasView {
  readonly cameraController: ICameraController;
  readonly pointerState: PointerState;
  readonly queryBus: QueryBus;
  private cursorMaterial: null | THREE.MeshLambertMaterial = null;
  private isPointerDown: boolean = false;
  private position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private scale: number = 1;
  private threeLoadingManager: THREE.LoadingManager;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    cameraController: ICameraController,
    canvasViewBag: CanvasViewBag,
    parentGroup: THREE.Group,
    pointerState: PointerState,
    queryBus: QueryBus,
    threeLoadingManager: THREE.LoadingManager
  ) {
    super(loggerBreadcrumbs, canvasViewBag, parentGroup);
    autoBind(this);

    this.cameraController = cameraController;
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
          child.renderOrder = 1000;

          material.emissive = new THREE.Color(0xffffff);
          material.emissiveIntensity = 0.1;
          material.fog = false;
          material.depthTest = false;
        }
      }
    }

    this.children.add(response.scene);

    this.cameraController.onZoomChange.add(this.onZoomChange);

    this.onZoomChange(this.cameraController.getZoom());
    this.setVisible(false);
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.cameraController.onZoomChange.delete(this.onZoomChange);
  }

  getCursorMaterial(): THREE.MeshLambertMaterial {
    const material = this.cursorMaterial;

    if (!material) {
      throw new Error("Cursor material is not created but it was expected.");
    }

    return material;
  }

  getName(): "Cursor" {
    return "Cursor";
  }

  onZoomChange(zoom: number): void {
    const scale = 1 / zoom;

    this.children.scale.set(scale, scale, scale);
    this.scale = scale;
  }

  setPosition(position: THREE.Vector3): void {
    this.position = position;
    this.children.position.set(position.x + this.scale * 32, position.y + this.scale * 48, position.z + this.scale * 32);
  }

  setVisible(isVisible: boolean): void {
    this.children.visible = isVisible;
  }

  update(delta: number): void {
    super.update(delta);

    this.children.rotation.x += 0.1;
  }

  useUpdate(): true {
    return true;
  }
}
