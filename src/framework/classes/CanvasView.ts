import * as THREE from "three";

import disposeObject3D from "src/framework/helpers/disposeObject3D";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasView as CanvasViewInterface } from "src/framework/interfaces/CanvasView";
import { CanvasViewBag } from "src/framework/interfaces/CanvasViewBag";

export default abstract class CanvasView implements CanvasViewInterface {
  readonly canvasViewBag: CanvasViewBag;
  readonly children: THREE.Group;
  private _isAttached: boolean;
  private _isDisposed: boolean;

  static useBegin: boolean = true;
  static useEnd: boolean = true;
  static useUpdate: boolean = true;

  constructor(canvasViewBag: CanvasViewBag) {
    this.canvasViewBag = canvasViewBag;
    this.children = new THREE.Group();
    this._isAttached = false;
    this._isDisposed = false;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    this._isAttached = true;
    this._isDisposed = false;
  }

  begin(): void {}

  async dispose(cancelToken: CancelToken): Promise<void> {
    this._isAttached = false;
    await this.canvasViewBag.dispose(cancelToken);
    disposeObject3D(this.getChildren(), true);
    this._isDisposed = true;
  }

  draw(interpolationPercentage: number): void {}

  end(fps: number, isPanicked: boolean): void {}

  getChildren(): THREE.Group {
    return this.children;
  }

  isAttached(): boolean {
    return this._isAttached;
  }

  isDisposed(): boolean {
    return this._isDisposed;
  }

  isInFrustum(frustum: THREE.Frustum): boolean {
    return false;
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

  update(delta: number): void {}

  useBegin(): boolean {
    return false;
  }

  useDraw(): boolean {
    return false;
  }

  useEnd(): boolean {
    return false;
  }

  useSettings(): boolean {
    return false;
  }

  useUpdate(): boolean {
    return false;
  }
}
