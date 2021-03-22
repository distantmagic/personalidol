import { getPointerVectorY } from "./getPointerVectorY";
import { MouseIndices } from "./MouseIndices.enum";

export function getMousePointerVectorY(dimensionsState: Uint32Array, mouseState: Int32Array): number {
  return getPointerVectorY(dimensionsState, mouseState[MouseIndices.M_RELATIVE_Y]);
}
