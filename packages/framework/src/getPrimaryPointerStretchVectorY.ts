import { Input } from "./Input";
import { InputIndices } from "./InputIndices.enum";

export function getPrimaryPointerStretchVectorY(inputState: Int32Array): number {
  if (inputState[InputIndices.M_LAST_USED] > inputState[InputIndices.T_LAST_USED]) {
    return inputState[InputIndices.M_STRETCH_VECTOR_Y] / Input.vector_scale;
  }

  return inputState[InputIndices.T0_STRETCH_VECTOR_Y] / Input.vector_scale;
}
