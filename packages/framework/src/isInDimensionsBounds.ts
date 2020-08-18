import { Dimensions } from "./Dimensions";

export function isInDimensionsBounds(dimensionsState: Uint32Array, clientX: number, clientY: number): boolean {
  // prettier-ignore
  return clientX > dimensionsState[Dimensions.code.P_LEFT]
    && clientY > dimensionsState[Dimensions.code.P_TOP]
    && clientX < dimensionsState[Dimensions.code.P_RIGHT]
    && clientY < dimensionsState[Dimensions.code.P_BOTTOM]
  ;
}
