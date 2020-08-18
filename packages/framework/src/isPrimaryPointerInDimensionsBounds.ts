import { isMousePointerInDimensionsBounds } from "./isMousePointerInDimensionsBounds";
import { isPromaryTouchInDimensionsBounds } from "./isPromaryTouchInDimensionsBounds";

export function isPrimaryPointerInDimensionsBounds(dimensionsState: Uint32Array, inputState: Int32Array): boolean {
  return isPromaryTouchInDimensionsBounds(dimensionsState, inputState) || isMousePointerInDimensionsBounds(dimensionsState, inputState);
}
