import * as THREE from "three";
import isEmpty from "lodash/isEmpty";

import dispose from "src/framework/helpers/dispose";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as ICanvasView } from "src/framework/interfaces/CanvasView";

export default abstract class CanvasView implements HasLoggerBreadcrumbs, ICanvasView {
  private _isAttached: boolean = false;
  private _isDisposed: boolean = false;
  readonly canvasViewBag: CanvasViewBag;
  readonly children: THREE.Group = new THREE.Group();
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly parentGroup: THREE.Group;

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

  begin(): void {}

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

  useUpdate(): boolean {
    return false;
  }
}
