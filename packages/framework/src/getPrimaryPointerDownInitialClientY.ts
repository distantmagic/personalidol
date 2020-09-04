import { Input } from "./Input";
import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { isPrimaryTouchPressed } from "./isPrimaryTouchPressed";

export function getPrimaryPointerDownInitialClientY(inputState: Int32Array): number {
  if (isPrimaryTouchPressed(inputState)) {
    return inputState[Input.code.T0_DOWN_INITIAL_CLIENT_Y];
  }

  if (isPrimaryMouseButtonPressed(inputState)) {
    return inputState[Input.code.M_DOWN_INITIAL_CLIENT_Y];
  }

  throw new Error("Neither mouse button nor touch point is pressed.");
}
