import { getPointerVectorY } from "./getPointerVectorY";
import { TouchIndices } from "./TouchIndices.enum";

export function getPrimaryTouchVectorY(dimensionsState: Uint32Array, touchState: Int32Array): number {
  return getPointerVectorY(dimensionsState, touchState[TouchIndices.T0_RELATIVE_Y]);
}
