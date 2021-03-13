import { MouseIndices } from "./MouseIndices.enum";
import { TouchIndices } from "./TouchIndices.enum";

export function getPrimaryPointerVectorY(mouseState: Int32Array, touchState: Int32Array): number {
  if (mouseState[MouseIndices.M_LAST_USED] > touchState[TouchIndices.T_LAST_USED]) {
    return mouseState[MouseIndices.M_VECTOR_Y] / mouseState[MouseIndices.M_VECTOR_SCALE];
  }

  return touchState[TouchIndices.T0_VECTOR_Y] / touchState[TouchIndices.T_VECTOR_SCALE];
}
