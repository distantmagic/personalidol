import { isMousePointerInDimensionsBounds } from "./isMousePointerInDimensionsBounds";
import { isPrimaryTouchInDimensionsBounds } from "./isPrimaryTouchInDimensionsBounds";

export function isPrimaryPointerInDimensionsBounds(dimensionsState: Uint32Array, mouseState: Int32Array, touchState: Int32Array): boolean {
  return isPrimaryTouchInDimensionsBounds(dimensionsState, touchState) || isMousePointerInDimensionsBounds(dimensionsState, mouseState);
}
