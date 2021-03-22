import { DimensionsIndices } from "@personalidol/framework/src/DimensionsIndices.enum";

export function computePointerVectorX(dimensionsState: Uint32Array, relativeX: number, scale: number): number {
  return scale * ((relativeX / dimensionsState[DimensionsIndices.D_WIDTH]) * 2 - 1);
}
