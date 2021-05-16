import { getMousePointerVectorY } from "./getMousePointerVectorY";
import { getPrimaryTouchVectorY } from "./getPrimaryTouchVectorY";
import { MouseIndices } from "./MouseIndices.enum";
import { TouchIndices } from "./TouchIndices.enum";

export function getPrimaryPointerVectorY(
  dimensionsState: Uint32Array,
  mouseState: Int32Array,
  touchState: Int32Array
): number {
  if (mouseState[MouseIndices.M_LAST_USED] > touchState[TouchIndices.T_LAST_USED]) {
    return getMousePointerVectorY(dimensionsState, mouseState);
  }

  return getPrimaryTouchVectorY(dimensionsState, touchState);
}
