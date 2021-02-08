import { InputIndices } from "./InputIndices.enum";

export function isPrimaryTouchInDimensionsBounds(dimensionsState: Uint32Array, inputState: Int32Array): boolean {
  return inputState[InputIndices.T_TOTAL] > 0 && inputState[InputIndices.T0_IN_BOUNDS] > 0;
}
