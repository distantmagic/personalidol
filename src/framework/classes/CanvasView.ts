import * as THREE from "three";

import disposeObject3D from "../helpers/disposeObject3D";

import { Group } from "three";

import { CancelToken } from "../interfaces/CancelToken";
import { CanvasView as CanvasViewInterface } from "../interfaces/CanvasView";
import { CanvasViewBag } from "../interfaces/CanvasViewBag";

export default class CanvasView implements CanvasViewInterface {
  readonly canvasViewBag: CanvasViewBag;
  readonly children: Group;
  _isAttached: boolean;
  _isDisposed: boolean;

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
    disposeObject3D(this.children, true);
    this._isDisposed = true;
  }

  draw(interpolationPercentage: number): void {}

  end(fps: number, isPanicked: boolean): void {}

  isAttached(): boolean {
    return this._isAttached;
  }

  isDisposed(): boolean {
    return this._isDisposed;
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
