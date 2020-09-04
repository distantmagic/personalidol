import { Input } from "./Input";
import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { isPrimaryTouchPressed } from "./isPrimaryTouchPressed";

export function getPrimaryPointerClientX(inputState: Int32Array): number {
  if (isPrimaryTouchPressed(inputState)) {
    return inputState[Input.code.T0_CLIENT_X];
  }

  if (isPrimaryMouseButtonPressed(inputState)) {
    return inputState[Input.code.M_CLIENT_X];
  }

  throw new Error("Neither mouse button nor touch point is pressed.");
}
