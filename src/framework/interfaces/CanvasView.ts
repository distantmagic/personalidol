import { Animatable } from "./Animatable";
import { CanvasPointerEventHandler } from "./CanvasPointerEventHandler";
import { Disposable } from "./Disposable";

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
