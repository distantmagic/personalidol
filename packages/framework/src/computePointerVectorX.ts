import { DimensionsIndices } from "./DimensionsIndices.enum";
import { Input } from "./Input";

export function computePointerVectorX(dimensionsState: Uint32Array, relativeX: number): number {
  return Input.vector_scale * ((relativeX / dimensionsState[DimensionsIndices.D_WIDTH]) * 2 - 1);
}
