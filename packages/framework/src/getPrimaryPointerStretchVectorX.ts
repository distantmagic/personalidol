import { Pointer } from "./Pointer";
import { PointerIndices } from "./PointerIndices.enum";

export function getPrimaryPointerStretchVectorX(pointerState: Int32Array): number {
  if (pointerState[PointerIndices.M_LAST_USED] > pointerState[PointerIndices.T_LAST_USED]) {
    return pointerState[PointerIndices.M_STRETCH_VECTOR_X] / Pointer.vector_scale;
  }

  return pointerState[PointerIndices.T0_STRETCH_VECTOR_X] / Pointer.vector_scale;
}
