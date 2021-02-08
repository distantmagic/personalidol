import { DimensionsIndices } from "./DimensionsIndices.enum";

export function isInDimensionsBounds(dimensionsState: Uint32Array, clientX: number, clientY: number): boolean {
  // prettier-ignore
  return clientX > dimensionsState[DimensionsIndices.P_LEFT]
    && clientY > dimensionsState[DimensionsIndices.P_TOP]
    && clientX < dimensionsState[DimensionsIndices.P_RIGHT]
    && clientY < dimensionsState[DimensionsIndices.P_BOTTOM]
  ;
}
