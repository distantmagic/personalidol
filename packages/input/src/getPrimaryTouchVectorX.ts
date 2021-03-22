import { getPointerVectorX } from "./getPointerVectorX";
import { TouchIndices } from "./TouchIndices.enum";

export function getPrimaryTouchVectorX(dimensionsState: Uint32Array, touchState: Int32Array): number {
  return getPointerVectorX(dimensionsState, touchState[TouchIndices.T0_RELATIVE_X]);
}
