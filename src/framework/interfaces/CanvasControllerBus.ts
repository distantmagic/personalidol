import { CancelToken } from "./CancelToken";
import { CanvasController } from "./CanvasController";

export interface CanvasControllerBus {
  add(cancelToken: CancelToken, canvasController: CanvasController): Promise<void>;

  delete(cancelToken: CancelToken, canvasController: CanvasController): Promise<void>;
}
