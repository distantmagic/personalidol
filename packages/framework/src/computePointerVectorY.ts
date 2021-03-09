import { DimensionsIndices } from "./DimensionsIndices.enum";

export function computePointerVectorY(dimensionsState: Uint32Array, relativeY: number, scale: number): number {
  return scale * (-1 * (relativeY / dimensionsState[DimensionsIndices.D_HEIGHT]) * 2 + 1);
}
