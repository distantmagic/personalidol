import * as THREE from "three";
import autoBind from "auto-bind";
import clamp from "lodash/clamp";

import CanvasController from "src/framework/classes/CanvasController";
import EventListenerSet from "src/framework/classes/EventListenerSet";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import ElementSize from "src/framework/interfaces/ElementSize";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as ICameraController } from "src/framework/interfaces/CanvasController/Camera";
import { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";

export default class Camera extends CanvasController implements HasLoggerBreadcrumbs, ICameraController {
  readonly camera: THREE.PerspectiveCamera;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly onZoomChange: IEventListenerSet<[number]>;
  private height: number = 0;
  private needsUpdate: boolean = true;
  private width: number = 0;
  private zoom: number = 3;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, camera: THREE.PerspectiveCamera) {
    super(canvasViewBag);
    autoBind(this);

    this.camera = camera;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.onZoomChange = new EventListenerSet<[number]>(loggerBreadcrumbs.add("EventListenerSet"));
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    super.attach(cancelToken);

    // this.camera.near = -512;
    this.camera.far = 4096;
    // this.lookAt(new THREE.Vector3(256 * 2, 0, 256 * 2));
    // this.lookAt(new THREE.Vector3(0, 0, 0));
    this.lookAt(new THREE.Vector3(256, 0, 256 * 2));
    this.needsUpdate = true;
  }

  begin(): void {
    super.begin();

    if (!this.needsUpdate) {
      return;
    }

    this.needsUpdate = false;
    this.updateProjectionMatrix();
  }

  decreaseZoom(): void {
    this.setZoom(this.zoom - 1);
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    super.dispose(cancelToken);
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getCameraFrustum(): THREE.Frustum {
    const frustum = new THREE.Frustum();

    frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));

    return frustum;
  }

  getZoom(): number {
    return this.zoom;
  }

  increaseZoom(): void {
    this.setZoom(this.zoom + 1);
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

    this.needsUpdate = true;
  }

  setZoom(zoom: number): void {
    const clampedZoom = clamp(zoom, 1, 4);

    if (this.zoom === clampedZoom) {
      return;
    }

    this.zoom = clampedZoom;
    this.needsUpdate = true;

    this.onZoomChange.notify([clampedZoom]);
  }

  updateProjectionMatrix() {
    this.camera.aspect = this.width / this.height;
    this.camera.zoom = this.zoom;
    this.camera.updateProjectionMatrix();
  }

  useBegin(): true {
    return true;
  }
}
