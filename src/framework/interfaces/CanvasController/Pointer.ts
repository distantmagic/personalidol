import CanvasController from "src/framework/interfaces/CanvasController";

export default interface Pointer extends CanvasController {
  onContextMenu(evt: MouseEvent): void;

  onMouseChange(evt: MouseEvent): void;

  onMouseDown(evt: MouseEvent): void;

  onMouseMove(evt: MouseEvent): void;

  onMouseUp(evt: MouseEvent): void;

  onWheel(evt: MouseEvent): void;
}
