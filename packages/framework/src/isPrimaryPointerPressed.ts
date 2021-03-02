import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { isPrimaryTouchPressed } from "./isPrimaryTouchPressed";

export function isPrimaryPointerPressed(pointerState: Int32Array): boolean {
  return isPrimaryTouchPressed(pointerState) || isPrimaryMouseButtonPressed(pointerState);
}
