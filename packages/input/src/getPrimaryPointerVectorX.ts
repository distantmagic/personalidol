import { getMousePointerVectorX } from "./getMousePointerVectorX";
import { getPrimaryTouchVectorX } from "./getPrimaryTouchVectorX";
import { MouseIndices } from "./MouseIndices.enum";
import { TouchIndices } from "./TouchIndices.enum";

export function getPrimaryPointerVectorX(
  dimensionsState: Uint32Array,
  mouseState: Int32Array,
  touchState: Int32Array
): number {
  if (mouseState[MouseIndices.M_LAST_USED] > touchState[TouchIndices.T_LAST_USED]) {
    return getMousePointerVectorX(dimensionsState, mouseState);
  }

  return getPrimaryTouchVectorX(dimensionsState, touchState);
}
