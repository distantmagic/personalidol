import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasController from "src/framework/interfaces/CanvasController";
import Observer from "src/framework/interfaces/Observer";
import Positionable from "src/framework/interfaces/Positionable";
import Resizeable from "src/framework/interfaces/Resizeable";

export default interface CanvasControllerBus extends Observer, Positionable<ElementPositionUnit.Px>, Resizeable<ElementPositionUnit.Px> {
  add(cancelToken: CancelToken, canvasController: CanvasController): Promise<void>;

  delete(cancelToken: CancelToken, canvasController: CanvasController): Promise<void>;
}
