import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasView from "src/framework/interfaces/CanvasView";

export default interface CanvasViewBus {
  add(cancelToken: CancelToken, canvasView: CanvasView): Promise<void>;

  delete(cancelToken: CancelToken, canvasView: CanvasView): Promise<void>;
}
