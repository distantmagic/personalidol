import * as THREE from "three";

import AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";
import Observer from "src/framework/interfaces/Observer";
import Resizeable from "src/framework/interfaces/Resizeable";

export default interface CanvasPointerInteraction extends AnimatableUpdatable, Observer, Resizeable<"px"> {
  onContextMenu(evt: MouseEvent): void;

  onMouseChange(evt: MouseEvent): void;

  onMouseDown(evt: MouseEvent): void;

  onMouseMove(evt: MouseEvent): void;

  onMouseUp(evt: MouseEvent): void;

  onWheel(evt: MouseEvent): void;
}
