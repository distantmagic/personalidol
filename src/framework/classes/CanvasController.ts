import { CancelToken } from "../interfaces/CancelToken";
import { CanvasController as CanvasControllerInterface } from "../interfaces/CanvasController";
import { CanvasViewBag } from "../interfaces/CanvasViewBag";
import { ElementSize } from "../interfaces/ElementSize";

export default class CanvasController implements CanvasControllerInterface {
  readonly canvasViewBag: CanvasViewBag;
  _isAttached: boolean;
  _isDisposed: boolean;

  constructor(canvasViewBag: CanvasViewBag) {
    this.canvasViewBag = canvasViewBag;
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
