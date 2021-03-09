import { Mouse } from "./Mouse";
import { MouseIndices } from "./MouseIndices.enum";
import { Touch } from "./Touch";
import { TouchIndices } from "./TouchIndices.enum";

export function getPrimaryPointerStretchVectorY(mouseState: Int32Array, touchState: Int32Array): number {
  if (mouseState[MouseIndices.M_LAST_USED] > touchState[TouchIndices.T_LAST_USED]) {
    return mouseState[MouseIndices.M_STRETCH_VECTOR_Y] / Mouse.vector_scale;
  }

  return touchState[TouchIndices.T0_STRETCH_VECTOR_Y] / Touch.vector_scale;
}
