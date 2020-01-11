import { CanvasController } from "./CanvasController";

export interface CameraController extends CanvasController {
  setZoom(zoom: number): void;
}
