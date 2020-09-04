import { Input } from "./Input";
import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { isPrimaryTouchPressed } from "./isPrimaryTouchPressed";

export function getPrimaryPointerClientY(inputState: Int32Array): number {
  if (isPrimaryTouchPressed(inputState)) {
    return inputState[Input.code.T0_CLIENT_Y];
  }

  if (isPrimaryMouseButtonPressed(inputState)) {
    return inputState[Input.code.M_CLIENT_Y];
  }

  throw new Error("Neither mouse button nor touch point is pressed.");
}
