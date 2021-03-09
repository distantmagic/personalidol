import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { isPrimaryTouchPressed } from "./isPrimaryTouchPressed";

export function isPrimaryPointerPressed(mouseState: Int32Array, touchState: Int32Array): boolean {
  return isPrimaryTouchPressed(touchState) || isPrimaryMouseButtonPressed(mouseState);
}
