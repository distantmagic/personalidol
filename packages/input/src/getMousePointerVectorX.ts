import { getPointerVectorX } from "./getPointerVectorX";
import { MouseIndices } from "./MouseIndices.enum";

export function getMousePointerVectorX(dimensionsState: Uint32Array, mouseState: Int32Array): number {
  return getPointerVectorX(dimensionsState, mouseState[MouseIndices.M_RELATIVE_X]);
}
