import { TouchIndices } from "./TouchIndices.enum";

export function isPrimaryTouchPressed(touchState: Int32Array): boolean {
  return touchState[TouchIndices.T_TOTAL] > 0 && touchState[TouchIndices.T0_IN_BOUNDS] > 0;
}
