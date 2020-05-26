import cancelable from "src/framework/decorators/cancelable";

import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type ElementPosition from "src/framework/interfaces/ElementPosition";
import type ElementSize from "src/framework/interfaces/ElementSize";
import type { default as ICanvasController } from "src/framework/interfaces/CanvasController";

export default class CanvasController implements ICanvasController {
  readonly canvasViewBag: CanvasViewBag;
  private _isAttached: boolean = false;
  private _isDisposed: boolean = false;

  constructor(canvasViewBag: CanvasViewBag) {
    this.canvasViewBag = canvasViewBag;
  }

  // @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {}

  // @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await this.canvasViewBag.dispose(cancelToken);
  }

  draw(delta: number): void {}

  isAttached(): boolean {
    return this._isAttached;
  }

  isDisposed(): boolean {
    return this._isDisposed;
  }

  resize(elementSize: ElementSize<ElementPositionUnit.Px>): void {}

  setIsAttached(isAttached: boolean): void {
    this._isAttached = isAttached;
  }

  setIsDisposed(isDisposed: boolean): void {
    this._isDisposed = isDisposed;
  }

  setPosition(elementPosition: ElementPosition<ElementPositionUnit.Px>): void {}

  update(delta: number): void {}

  useDraw(): SchedulerUpdateScenario {
    return SchedulerUpdateScenario.Never;
  }

  useUpdate(): SchedulerUpdateScenario {
    return SchedulerUpdateScenario.Never;
  }
}
