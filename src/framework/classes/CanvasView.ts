import * as THREE from "three";
import isEmpty from "lodash/isEmpty";

import dispose from "src/framework/helpers/dispose";

import { default as CanvasViewException } from "src/framework/classes/Exception/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as ICanvasView } from "src/framework/interfaces/CanvasView";

export default abstract class CanvasView implements HasLoggerBreadcrumbs, ICanvasView {
  readonly canvasViewBag: CanvasViewBag;
  readonly children: THREE.Group = new THREE.Group();
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly parentGroup: THREE.Group;
  protected boundingBox: null | THREE.Box3 = null;
  private _isAttached: boolean = false;
  private _isDisposed: boolean = false;
  private _isInCameraFrustum: boolean = false;

  static useBegin: boolean = true;
  static useEnd: boolean = true;
  static useUpdate: boolean = true;

  abstract getName(): string;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, parentGroup: THREE.Group) {
    this.canvasViewBag = canvasViewBag;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.parentGroup = parentGroup;
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    this._isAttached = true;
    this._isDisposed = false;

    this.parentGroup.add(this.children);
  }

  attachCamera(camera: THREE.Camera): void {
    this.children.add(camera);
  }

  computeBoundingBox(): void {
    this.boundingBox = new THREE.Box3().setFromObject(this.children);
  }

  detachCamera(camera: THREE.Camera): void {
    this.children.remove(camera);
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    this._isAttached = false;
    this._isDisposed = true;

    await this.canvasViewBag.dispose(cancelToken);

    dispose(this.loggerBreadcrumbs.add("dispose"), this.children);

    while (!isEmpty(this.children.children)) {
      this.children.remove(this.children.children[0]);
    }

    this.parentGroup.remove(this.children);
  }

  getBoundingBox(): THREE.Box3 {
    const boundingBox = this.boundingBox;

    if (!boundingBox) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("getBoundingBox"), "Bounding box has never been computed, but it is expected to be.");
    }

    return boundingBox;
  }

  getChildren(): THREE.Group {
    return this.children;
  }

  getPosition(): THREE.Vector3 {
    return this.getChildren().position;
  }

  isAttached(): boolean {
    return this._isAttached;
  }

  isDisposed(): boolean {
    return this._isDisposed;
  }

  isInCameraFrustum(): boolean {
    return this._isInCameraFrustum;
  }

  isInFrustum(frustum: THREE.Frustum): boolean {
    return frustum.intersectsBox(this.getBoundingBox());
  }

  onPointerAuxiliaryClick(): void {}

  onPointerAuxiliaryDepressed(): void {}

  onPointerAuxiliaryPressed(): void {}

  onPointerOut(): void {}

  onPointerOver(): void {}

  onPointerPrimaryClick(): void {}

  onPointerPrimaryDepressed(): void {}

  onPointerPrimaryPressed(): void {}

  onPointerSecondaryClick(): void {}

  onPointerSecondaryDepressed(): void {}

  onPointerSecondaryPressed(): void {}

  setIsInCameraFrustum(isInCameraFrustum: boolean): void {
    this._isInCameraFrustum = isInCameraFrustum;
    this.children.visible = isInCameraFrustum;
  }

  update(delta: number): void {}

  useCameraFrustum(): boolean {
    return false;
  }

  useUpdate(): SchedulerUpdateScenario {
    return SchedulerUpdateScenario.Never;
  }
}
