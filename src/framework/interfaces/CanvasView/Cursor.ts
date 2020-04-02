import type CanvasView from "src/framework/interfaces/CanvasView";

export default interface Cursor extends CanvasView {
  setVisible(isVisible: boolean): void;
}
