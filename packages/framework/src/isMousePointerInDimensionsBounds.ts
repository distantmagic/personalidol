import { PointerIndices } from "./PointerIndices.enum";

export function isMousePointerInDimensionsBounds(dimensionsState: Uint32Array, pointerState: Int32Array): boolean {
  return pointerState[PointerIndices.M_IN_BOUNDS] > 0;
}
