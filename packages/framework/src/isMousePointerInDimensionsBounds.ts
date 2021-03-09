import { MouseIndices } from "./MouseIndices.enum";

export function isMousePointerInDimensionsBounds(dimensionsState: Uint32Array, mouseState: Int32Array): boolean {
  return mouseState[MouseIndices.M_IN_BOUNDS] > 0;
}
