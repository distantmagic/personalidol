import { DimensionsIndices } from "./DimensionsIndices.enum";
import { Pointer } from "./Pointer";

export function computePointerVectorY(dimensionsState: Uint32Array, relativeY: number): number {
  return Pointer.vector_scale * (-1 * (relativeY / dimensionsState[DimensionsIndices.D_HEIGHT]) * 2 + 1);
}
