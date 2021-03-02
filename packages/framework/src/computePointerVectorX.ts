import { DimensionsIndices } from "./DimensionsIndices.enum";
import { Pointer } from "./Pointer";

export function computePointerVectorX(dimensionsState: Uint32Array, relativeX: number): number {
  return Pointer.vector_scale * ((relativeX / dimensionsState[DimensionsIndices.D_WIDTH]) * 2 - 1);
}
