import { PointerIndices } from "./PointerIndices.enum";

export function getPrimaryPointerClientY(pointerState: Int32Array): number {
  if (pointerState[PointerIndices.M_LAST_USED] > pointerState[PointerIndices.T_LAST_USED]) {
    return pointerState[PointerIndices.M_CLIENT_Y];
  }

  return pointerState[PointerIndices.T0_CLIENT_Y];
}
