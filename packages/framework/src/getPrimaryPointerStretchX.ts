import { Input } from "./Input";
import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { isPrimaryTouchPressed } from "./isPrimaryTouchPressed";

export function getPrimaryPointerStretchX(inputState: Int32Array): number {
  if (isPrimaryTouchPressed(inputState)) {
    return inputState[Input.code.T0_STRETCH_X];
  }

  if (isPrimaryMouseButtonPressed(inputState)) {
    return inputState[Input.code.M_STRETCH_X];
  }

  throw new Error("Neither mouse button nor touch point is pressed.");
}
