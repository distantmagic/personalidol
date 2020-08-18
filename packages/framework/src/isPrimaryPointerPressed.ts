import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { isPrimaryTouchPressed } from "./isPrimaryTouchPressed";

export function isPrimaryPointerPressed(inputState: Int32Array): boolean {
  return isPrimaryTouchPressed(inputState) || isPrimaryMouseButtonPressed(inputState);
}
