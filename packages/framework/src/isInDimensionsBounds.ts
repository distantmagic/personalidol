import { Dimensions } from "./Dimensions";

export function isInDimensionsBounds(dimensionsState: Uint16Array, clientX: number, clientY: number): boolean {
  // prettier-ignore
  return clientX > dimensionsState[Dimensions.code.P_LEFT]
    && clientY > dimensionsState[Dimensions.code.P_TOP]
    && clientX < dimensionsState[Dimensions.code.P_RIGHT]
    && clientY < dimensionsState[Dimensions.code.P_BOTTOM]
  ;
}
