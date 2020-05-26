import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasController from "src/framework/interfaces/CanvasController";
import type Observer from "src/framework/interfaces/Observer";
import type Resizeable from "src/framework/interfaces/Resizeable";

export default interface CanvasControllerBus extends Observer, Resizeable<ElementPositionUnit.Px> {
  add(cancelToken: CancelToken, canvasController: CanvasController): Promise<void>;

  delete(cancelToken: CancelToken, canvasController: CanvasController): Promise<void>;
}
