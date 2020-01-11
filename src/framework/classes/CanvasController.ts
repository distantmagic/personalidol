// @flow strict

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasController as CanvasControllerInterface } from "../interfaces/CanvasController";
import type { CanvasViewBag } from "../interfaces/CanvasViewBag";
import type { ElementSize } from "../interfaces/ElementSize";

export default class CanvasController implements CanvasControllerInterface {
  +canvasViewBag: CanvasViewBag;
  #isAttached: boolean;
  #isDisposed: boolean;

  constructor(canvasViewBag: CanvasViewBag) {
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

  draw(interpolationPercentage: number): void {}

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

  resize(elementSize: ElementSize<"px">): void {}

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
