import { CancelToken } from "./CancelToken";
import { CanvasView } from "./CanvasView";

export interface CanvasViewBus {
  add(cancelToken: CancelToken, canvasView: CanvasView): Promise<void>;

  delete(cancelToken: CancelToken, canvasView: CanvasView): Promise<void>;
}
