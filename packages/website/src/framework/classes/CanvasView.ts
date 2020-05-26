import * as OIMO from "oimo";
import * as THREE from "three";
import isEmpty from "lodash/isEmpty";

import dispose from "src/framework/helpers/dispose";

import ElementRotation from "src/framework/classes/ElementRotation";
import { default as CanvasViewException } from "src/framework/classes/Exception/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import ElementRotationUnit from "src/framework/enums/ElementRotationUnit";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as ICanvasView } from "src/framework/interfaces/CanvasView";
import type { default as IElementRotation } from "src/framework/interfaces/ElementRotation";

export default abstract class CanvasView implements HasLoggerBreadcrumbs, ICanvasView {
  readonly canvasViewBag: CanvasViewBag;
  readonly children: THREE.Group = new THREE.Group();
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly parentGroup: THREE.Group;
  protected boundingBox: null | THREE.Box3 = null;
  protected boundingSphere: null | THREE.Sphere = null;
  protected physicsBody: null | OIMO.Body = null;
  private _isAttached: boolean = false;
  private _isDisposed: boolean = false;
  private _isInCameraFrustum: boolean = false;
  // using .getName() is redundant here, because we are using UUID anyway,
  // but ID with a human readable name is better for debugging
  private instanceId: string = `${this.getName()}.${THREE.MathUtils.generateUUID()}`;
  private translationVector: THREE.Vector3 = new THREE.Vector3();

  static useBegin: boolean = true;
  static useEnd: boolean = true;
  static useUpdate: boolean = true;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, parentGroup: THREE.Group) {
    this.canvasViewBag = canvasViewBag;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.parentGroup = parentGroup;
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    this.parentGroup.add(this.children);
  }

  attachCamera(camera: THREE.Camera): void {
    // this.children.add(camera);
  }

  computeBoundingBox(recalculate: boolean): void {
    if (!recalculate && this.hasBoundingBox()) {
      return;
    }

    this.boundingBox = new THREE.Box3().setFromObject(this.children);
  }

  computeBoundingSphere(recalculate: boolean): void {
    if (!recalculate && this.hasBoundingSphere()) {
      return;
    }

    this.computeBoundingBox(recalculate);

    const boundingBox = this.getBoundingBox();
    const boundingBoxCenter = new THREE.Vector3();
    const boundingBoxSize = new THREE.Vector3();

    boundingBox.getCenter(boundingBoxCenter);
    boundingBox.getSize(boundingBoxSize);

    this.boundingSphere = new THREE.Sphere(boundingBoxCenter, boundingBoxSize.y / 2);
  }

  detachCamera(camera: THREE.Camera): void {
    this.children.remove(camera);
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
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

  getBoundingSphere(): THREE.Sphere {
    const boundingSphere = this.boundingSphere;

    if (!boundingSphere) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("getBoundingSphere"), "Bounding sphere has never been computed, but it is expected to be.");
    }

    return boundingSphere;
  }

  getChildren(): THREE.Group {
    return this.children;
  }

  getInstanceId(): string {
    return this.instanceId;
  }

  getName(): string {
    return this.constructor.name;
  }

  getPhysicsBody(): OIMO.Body {
    const physicsBody = this.physicsBody;

    if (!physicsBody) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("getPhysicsBody"), "Physics body is not set but it was expected.");
    }

    return physicsBody;
  }

  getPosition(): THREE.Vector3 {
    return this.getChildren().position;
  }

  getRotation(): IElementRotation<ElementRotationUnit.Radians> {
    return new ElementRotation<ElementRotationUnit.Radians>(ElementRotationUnit.Radians, 0, 0, 0);
  }

  getShapeType(): "box" | "cylinder" | "plane" | "sphere" {
    return "box";
  }

  hasBoundingBox(): boolean {
    return !!this.boundingBox;
  }

  hasBoundingSphere(): boolean {
    return !!this.boundingSphere;
  }

  hasPhysicsBody(): boolean {
    return !!this.physicsBody;
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
    return true;
    // return frustum.intersectsBox(this.getBoundingBox());
  }

  isStatic(): boolean {
    return true;
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

  setIsAttached(isAttached: boolean): void {
    this._isAttached = isAttached;
  }

  setIsDisposed(isDisposed: boolean): void {
    this._isDisposed = isDisposed;
  }

  setIsInCameraFrustum(isInCameraFrustum: boolean): void {
    this._isInCameraFrustum = isInCameraFrustum;
    this.children.visible = isInCameraFrustum;
  }

  setPhysicsBody(physicsBody: OIMO.Body): void {
    this.physicsBody = physicsBody;
  }

  setPosition(x: number, y: number, z: number): void {
    const boundingBox = this.getBoundingBox();

    const diffX = this.children.position.x - x;
    const diffY = this.children.position.y - y;
    const diffZ = this.children.position.z - z;

    this.translationVector.set(diffX, diffY, diffZ);
    this.children.position.set(x, y, z);

    boundingBox.translate(this.translationVector);
  }

  setRotation(quaternion: THREE.Quaternion): void {
    this.children.quaternion.copy(quaternion);
  }

  update(delta: number): void {}

  updateFromPhysicsBody(dynamicBody: OIMO.Body): void {
    this.setPosition(dynamicBody.position.x, dynamicBody.position.y, dynamicBody.position.z);
    // controller.setRotation(this._rotationQuaternion)
  }

  useCameraFrustum(): boolean {
    return false;
  }

  usePhysics(): boolean {
    return false;
  }

  useUpdate(): SchedulerUpdateScenario {
    return SchedulerUpdateScenario.Never;
  }
}
