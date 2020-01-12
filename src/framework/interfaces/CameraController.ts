import { CanvasController } from "src/framework/interfaces/CanvasController";

export interface CameraController extends CanvasController {
  setZoom(zoom: number): void;
}
