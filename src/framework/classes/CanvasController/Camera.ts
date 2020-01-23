import * as THREE from "three";
import autoBind from "auto-bind";
import clamp from "lodash/clamp";

import CanvasController from "src/framework/classes/CanvasController";
import Controllable from "src/framework/classes/Controllable";
import ControlToken from "src/framework/classes/ControlToken";

import cancelable from "src/framework/decorators/cancelable";
import controlled from "src/framework/decorators/controlled";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import ElementSize from "src/framework/interfaces/ElementSize";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as ICameraController } from "src/framework/interfaces/CameraController";
import { default as IControllable } from "src/framework/interfaces/Controllable";
import { default as IControlToken } from "src/framework/interfaces/ControlToken";

export default class CameraController extends CanvasController implements HasLoggerBreadcrumbs, ICameraController {
  private readonly controllable: IControllable;
  private height: number;
  private width: number;
  private zoomTarget: number;
  readonly camera: THREE.OrthographicCamera;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, camera: THREE.OrthographicCamera) {
    super(canvasViewBag);
    autoBind(this);

    this.camera = camera;
    this.controllable = new Controllable(loggerBreadcrumbs.add("Controllable"));
    this.height = 0;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.width = 0;
    this.zoomTarget = 2;
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    super.attach(cancelToken);

    this.camera.near = -512;
    this.camera.far = 4096;
    // this.lookAt(new THREE.Vector3(256 * 2, 0, 256 * 2));
    // this.lookAt(new THREE.Vector3(0, 0, 0));
    this.lookAt(new THREE.Vector3(256, 0, 256 * 2));
  }

  cedeControlToken(controlToken: IControlToken): void {}

  decreaseZoom(controlToken: IControlToken): void {
    this.setZoom(controlToken, this.zoomTarget - 1);
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    super.dispose(cancelToken);
  }

  getCameraFrustum(): THREE.Frustum {
    const frustum = new THREE.Frustum();

    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));

    return frustum;
  }

  getControllable(): IControllable {
    return this.controllable;
  }

  increaseZoom(controlToken: IControlToken): void {
    this.setZoom(controlToken, this.zoomTarget + 1);
  }

  isControlled(): boolean {
    return false;
  }

  isControlledBy(controlToken: IControlToken): boolean {
    return false;
  }

  lookAt(position: THREE.Vector3): void {
    const baseDistance = 256 * 3;

    // prettier-ignore
    this.camera.position.set(
      position.x + baseDistance,
      position.y + baseDistance,
      position.z + baseDistance
    );

    this.camera.lookAt(position.clone());
    this.updateProjectionMatrix();
  }

  obtainControlToken(): IControlToken {
    return new ControlToken();
  }

  resize(viewportSize: ElementSize<"px">): void {
    super.resize(viewportSize);

    const height = viewportSize.getHeight();
    const width = viewportSize.getWidth();

    if (this.height === height && this.width === width) {
      return;
    }

    this.height = height;
    this.width = width;

    this.updateProjectionMatrix();
  }

  @controlled(true)
  setZoom(controlToken: IControlToken, zoom: number): void {
    const clampedZoom = clamp(zoom, 1, 6);

    if (this.zoomTarget === clampedZoom) {
      return;
    }

    this.zoomTarget = clampedZoom;
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    this.camera.left = -1 * (this.width / this.zoomTarget);
    this.camera.right = this.width / this.zoomTarget;
    this.camera.top = this.height / this.zoomTarget;
    this.camera.bottom = -1 * (this.height / this.zoomTarget);
    this.camera.updateProjectionMatrix();
  }
}
