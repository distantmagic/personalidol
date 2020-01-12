import { Animatable } from "src/framework/interfaces/Animatable";
import { CanvasPointerEventHandler } from "src/framework/interfaces/CanvasPointerEventHandler";
import { Disposable } from "src/framework/interfaces/Disposable";

export interface CanvasView extends Animatable, CanvasPointerEventHandler, Disposable {
  begin(): void;

  draw(interpolationPercentage: number): void;

  end(fps: number, isPanicked: boolean): void;

  useBegin(): boolean;

  useDraw(): boolean;

  useEnd(): boolean;

  useSettings(): boolean;

  useUpdate(): boolean;
}
