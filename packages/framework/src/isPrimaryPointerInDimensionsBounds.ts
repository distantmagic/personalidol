import { isMousePointerInDimensionsBounds } from "./isMousePointerInDimensionsBounds";
import { isPrimaryTouchInDimensionsBounds } from "./isPrimaryTouchInDimensionsBounds";

export function isPrimaryPointerInDimensionsBounds(dimensionsState: Uint32Array, inputState: Int32Array): boolean {
  return isPrimaryTouchInDimensionsBounds(dimensionsState, inputState) || isMousePointerInDimensionsBounds(dimensionsState, inputState);
}
