import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { isPrimaryTouchPressed } from "./isPrimaryTouchPressed";

export function isPrimaryPointerPressed(inputState: Int16Array): boolean {
  return isPrimaryTouchPressed(inputState) || isPrimaryMouseButtonPressed(inputState);
}
