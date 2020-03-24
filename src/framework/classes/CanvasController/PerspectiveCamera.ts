import * as THREE from "three";
import autoBind from "auto-bind";
import clamp from "lodash/clamp";

import CanvasController from "src/framework/classes/CanvasController";
import EventListenerSet from "src/framework/classes/EventListenerSet";

import cancelable from "src/framework/decorators/cancelable";

import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type ElementSize from "src/framework/interfaces/ElementSize";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";
import type { default as IPerspectiveCameraController } from "src/framework/interfaces/CanvasController/PerspectiveCamera";

export default class PerspectiveCamera extends CanvasController implements HasLoggerBreadcrumbs, IPerspectiveCameraController {
  readonly camera: THREE.PerspectiveCamera;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly onFrustumChange: IEventListenerSet<[THREE.Frustum]>;
  readonly onZoomChange: IEventListenerSet<[number]>;
  private height: number = 0;
  private aspectNeedsUpdate: boolean = true;
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
    this.aspectNeedsUpdate = true;
  }

  decreaseZoom(step: number, min: number): void {
    this.setZoom(clamp(this.zoom - step, min, this.zoom));
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    super.dispose(cancelToken);
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getZoom(): number {
    return this.zoom;
  }

  increaseZoom(step: number, max: number): void {
    this.setZoom(clamp(this.zoom + step, this.zoom, max));
  }

  lookAtFromDistance(position: THREE.Vector3, distance: number): void {
    const distanceVector = new THREE.Vector3(1, 1, 1)
      .normalize()
      .multiplyScalar(distance)
      .clampLength(0, distance);

    this.camera.position.copy(position).add(distanceVector);
    this.camera.lookAt(position);
  }

  resize(viewportSize: ElementSize<ElementPositionUnit.Px>): void {
    const height = viewportSize.getHeight();
    const width = viewportSize.getWidth();

    if (this.height === height && this.width === width) {
      return;
    }

    this.height = height;
    this.width = width;

    this.aspectNeedsUpdate = true;
  }

  setZoom(zoom: number): void {
    if (this.zoom === zoom) {
      return;
    }

    this.zoom = zoom;
    this.aspectNeedsUpdate = true;
    this.onZoomChange.notify([zoom]);
  }

  update(delta: number): void {
    if (this.aspectNeedsUpdate) {
      this.aspectNeedsUpdate = false;
      this.camera.aspect = this.width / this.height;
      this.camera.zoom = this.zoom;
      this.camera.updateProjectionMatrix();
    }
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
