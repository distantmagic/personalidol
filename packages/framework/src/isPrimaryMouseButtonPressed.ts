import { PointerIndices } from "./PointerIndices.enum";

export function isPrimaryMouseButtonPressed(pointerState: Int32Array): boolean {
  return pointerState[PointerIndices.M_BUTTON_L] > 0 && pointerState[PointerIndices.M_IN_BOUNDS] > 0;
}
