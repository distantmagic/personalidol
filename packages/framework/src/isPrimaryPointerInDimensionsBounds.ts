import { isMousePointerInDimensionsBounds } from "./isMousePointerInDimensionsBounds";
import { isPromaryTouchInDimensionsBounds } from "./isPromaryTouchInDimensionsBounds";

export function isPrimaryPointerInDimensionsBounds(dimensionsState: Uint16Array, inputState: Int16Array): boolean {
  return isPromaryTouchInDimensionsBounds(dimensionsState, inputState) || isMousePointerInDimensionsBounds(dimensionsState, inputState);
}
