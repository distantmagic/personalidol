import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasController } from "src/framework/interfaces/CanvasController";

export interface CanvasControllerBus {
  add(cancelToken: CancelToken, canvasController: CanvasController): Promise<void>;

  delete(cancelToken: CancelToken, canvasController: CanvasController): Promise<void>;
}
