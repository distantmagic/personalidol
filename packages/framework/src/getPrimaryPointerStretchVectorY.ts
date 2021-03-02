import { Pointer } from "./Pointer";
import { PointerIndices } from "./PointerIndices.enum";

export function getPrimaryPointerStretchVectorY(pointerState: Int32Array): number {
  if (pointerState[PointerIndices.M_LAST_USED] > pointerState[PointerIndices.T_LAST_USED]) {
    return pointerState[PointerIndices.M_STRETCH_VECTOR_Y] / Pointer.vector_scale;
  }

  return pointerState[PointerIndices.T0_STRETCH_VECTOR_Y] / Pointer.vector_scale;
}
