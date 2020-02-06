import * as THREE from "three";
import autoBind from "auto-bind";
import clamp from "lodash/clamp";

import CanvasController from "src/framework/classes/CanvasController";
import EventListenerSet from "src/framework/classes/EventListenerSet";

import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

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
  readonly onFrustumChange: IEventListenerSet<[THREE.Frustum]>;
  readonly onZoomChange: IEventListenerSet<[number]>;
  private frustumNeedsUpdate: boolean = true;
  private height: number = 0;
  private aspectNeedsUpdate: boolean = true;
  private tempCameraFrustum: THREE.Frustum = new THREE.Frustum();
  private tempProjectionMatrix: THREE.Matrix4 = new THREE.Matrix4();
  private width: number = 0;
  private zoom: number = 3;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, camera: THREE.PerspectiveCamera) {
    super(canvasViewBag);
    autoBind(this);

    this.camera = camera;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.onFrustumChange = new EventListenerSet<[THREE.Frustum]>(loggerBreadcrumbs.add("EventListenerSet"));
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

    this.aspectNeedsUpdate = true;
    this.frustumNeedsUpdate = true;
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
    return this.tempCameraFrustum;
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

    this.camera.lookAt(position);
    this.frustumNeedsUpdate = true;
  }

  resize(viewportSize: ElementSize<ElementPositionUnit.Px>): void {
    super.resize(viewportSize);

    const height = viewportSize.getHeight();
    const width = viewportSize.getWidth();

    if (this.height === height && this.width === width) {
      return;
    }

    this.height = height;
    this.width = width;

    this.aspectNeedsUpdate = true;
    this.frustumNeedsUpdate = true;
  }

  setZoom(zoom: number): void {
    const clampedZoom = clamp(zoom, 1, 5);

    if (this.zoom === clampedZoom) {
      return;
    }

    this.zoom = clampedZoom;
    this.aspectNeedsUpdate = true;
    this.frustumNeedsUpdate = true;
    this.onZoomChange.notify([clampedZoom]);
  }

  update(delta: number): void {
    super.update(delta);

    if (this.aspectNeedsUpdate) {
      this.aspectNeedsUpdate = false;
      this.camera.aspect = this.width / this.height;
      this.camera.zoom = this.zoom;
      this.camera.updateProjectionMatrix();
    }

    if (this.frustumNeedsUpdate) {
      this.frustumNeedsUpdate = false;
      this.tempCameraFrustum.setFromProjectionMatrix(this.tempProjectionMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));
    }
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
