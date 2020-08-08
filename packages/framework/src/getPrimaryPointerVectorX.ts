import { Input } from "./Input";
import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { isPrimaryTouchPressed } from "./isPrimaryTouchPressed";

export function getPrimaryPointerVectorX(inputState: Int16Array): number {
  if (isPrimaryTouchPressed(inputState)) {
    return inputState[Input.code.T0_VECTOR_X] / Input.vector_scale;
  }

  if (isPrimaryMouseButtonPressed(inputState)) {
    return inputState[Input.code.M_VECTOR_X] / Input.vector_scale;
  }

  throw new Error("Neither mouse button nor touch point is pressed.");
}
