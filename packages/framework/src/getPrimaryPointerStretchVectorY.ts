import { MouseIndices } from "./MouseIndices.enum";
import { MouseState } from "./MouseState";
import { TouchIndices } from "./TouchIndices.enum";
import { TouchState } from "./TouchState";

export function getPrimaryPointerStretchVectorY(mouseState: Int32Array, touchState: Int32Array): number {
  if (mouseState[MouseIndices.M_LAST_USED] > touchState[TouchIndices.T_LAST_USED]) {
    return mouseState[MouseIndices.M_STRETCH_VECTOR_Y] / MouseState.vector_scale;
  }

  return touchState[TouchIndices.T0_STRETCH_VECTOR_Y] / TouchState.vector_scale;
}
