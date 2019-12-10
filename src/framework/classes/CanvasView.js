// @flow

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasView as CanvasViewInterface } from "../interfaces/CanvasView";
import type { CanvasViewBag } from "../interfaces/CanvasViewBag";

export default class CanvasView implements CanvasViewInterface {
  +canvasViewBag: CanvasViewBag;
  #isAttached: boolean;
  #isDisposed: boolean;

  static useBegin: boolean = true;
  static useEnd: boolean = true;
  static useUpdate: boolean = true;

  constructor(canvasViewBag: CanvasViewBag): void {
    this.canvasViewBag = canvasViewBag;
    this.#isAttached = false;
    this.#isDisposed = false;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    this.#isAttached = true;
    this.#isDisposed = false;
  }

  begin(): void {}

  async dispose(cancelToken: CancelToken): Promise<void> {
    this.#isAttached = false;
    await this.canvasViewBag.dispose(cancelToken);
    this.#isDisposed = true;
  }

  end(fps: number, isPanicked: boolean): void {}

  isAttached(): boolean {
    return this.#isAttached;
  }

  isDisposed(): boolean {
    return this.#isDisposed;
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
