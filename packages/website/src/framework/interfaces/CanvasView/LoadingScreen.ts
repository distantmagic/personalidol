import type CanvasView from "src/framework/interfaces/CanvasView";

export default interface LoadingScreen extends CanvasView {
  setProgress(progress: number): void;
}
