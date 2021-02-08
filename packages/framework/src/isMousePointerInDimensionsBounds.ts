import { InputIndices } from "./InputIndices.enum";

export function isMousePointerInDimensionsBounds(dimensionsState: Uint32Array, inputState: Int32Array): boolean {
  return inputState[InputIndices.M_IN_BOUNDS] > 0;
}
