import { Input } from "./Input";
import { InputIndices } from "./InputIndices.enum";
import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { isPrimaryTouchPressed } from "./isPrimaryTouchPressed";

export function getPrimaryPointerStretchVectorY(inputState: Int32Array): number {
  if (isPrimaryTouchPressed(inputState)) {
    return inputState[InputIndices.T0_STRETCH_VECTOR_Y] / Input.vector_scale;
  }

  if (isPrimaryMouseButtonPressed(inputState)) {
    return inputState[InputIndices.M_STRETCH_VECTOR_Y] / Input.vector_scale;
  }

  throw new Error("Neither mouse button nor touch point is pressed.");
}
