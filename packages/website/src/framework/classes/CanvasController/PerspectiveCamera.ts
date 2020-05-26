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
import type HasPosition from "src/framework/interfaces/HasPosition";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";
import type { default as IPerspectiveCameraController } from "src/framework/interfaces/CanvasController/PerspectiveCamera";

const LOOK_AT_BASE_DISTANCE = 1024;

export default class PerspectiveCamera extends CanvasController implements HasLoggerBreadcrumbs, IPerspectiveCameraController {
  readonly camera: THREE.PerspectiveCamera;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly onFrustumChange: IEventListenerSet<[THREE.Frustum]>;
  readonly onZoomChange: IEventListenerSet<[number]>;
  private _following: null | HasPosition = null;
  private _height: number = 0;
  private _aspectNeedsUpdate: boolean = true;
  private _width: number = 0;
  private _zoom: number = 3;

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
    this._aspectNeedsUpdate = true;
  }

  decreaseZoom(step: number, min: number): void {
    this.setZoom(clamp(this._zoom - step, min, this._zoom));
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    super.dispose(cancelToken);
  }

  follow(hasPosition: HasPosition): void {
    this._following = hasPosition;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getZoom(): number {
    return this._zoom;
  }

  increaseZoom(step: number, max: number): void {
    this.setZoom(clamp(this._zoom + step, this._zoom, max));
  }

  lookAtFromDistance(position: THREE.Vector3, distance: number): void {
    const distanceVector = new THREE.Vector3(1, 1.2, 1)
      .normalize()
      .multiplyScalar(distance)
      .clampLength(0, distance);

    this.camera.position.copy(position).add(distanceVector);
    this.camera.lookAt(position);
  }

  onBeforeRender(delta: number): void {
    const following = this._following;

    if (!following) {
      return;
    }

    const followedPosition = following.getPosition();

    this.lookAtFromDistance(followedPosition, LOOK_AT_BASE_DISTANCE / this._zoom);
  }

  resize(viewportSize: ElementSize<ElementPositionUnit.Px>): void {
    const height = viewportSize.getHeight();
    const width = viewportSize.getWidth();

    if (this._height === height && this._width === width) {
      return;
    }

    this._height = height;
    this._width = width;

    this._aspectNeedsUpdate = true;
  }

  setZoom(zoom: number): void {
    if (this._zoom === zoom) {
      return;
    }

    this._zoom = zoom;
    this._aspectNeedsUpdate = true;
    this.onZoomChange.notify([zoom]);
  }

  unfollow(hasPosition: HasPosition): void {
    this._following = null;
  }

  update(delta: number): void {
    if (this._aspectNeedsUpdate) {
      this._aspectNeedsUpdate = false;
      this.camera.aspect = this._width / this._height;
      // this.camera.zoom = this._zoom;
      this.camera.updateProjectionMatrix();
    }
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
