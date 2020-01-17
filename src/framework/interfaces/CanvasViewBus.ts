import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasView from "src/framework/interfaces/CanvasView";

export default interface CanvasViewBus {
  add(cancelToken: CancelToken, canvasView: CanvasView): Promise<void>;

  delete(cancelToken: CancelToken, canvasView: CanvasView): Promise<void>;
}
