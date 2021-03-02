import { isMousePointerInDimensionsBounds } from "./isMousePointerInDimensionsBounds";
import { isPrimaryTouchInDimensionsBounds } from "./isPrimaryTouchInDimensionsBounds";

export function isPrimaryPointerInDimensionsBounds(dimensionsState: Uint32Array, pointerState: Int32Array): boolean {
  return isPrimaryTouchInDimensionsBounds(dimensionsState, pointerState) || isMousePointerInDimensionsBounds(dimensionsState, pointerState);
}
