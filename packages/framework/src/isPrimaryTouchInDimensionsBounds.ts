import { PointerIndices } from "./PointerIndices.enum";

export function isPrimaryTouchInDimensionsBounds(dimensionsState: Uint32Array, pointerState: Int32Array): boolean {
  return pointerState[PointerIndices.T_TOTAL] > 0 && pointerState[PointerIndices.T0_IN_BOUNDS] > 0;
}
