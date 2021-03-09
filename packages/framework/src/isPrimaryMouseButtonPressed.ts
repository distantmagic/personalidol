import { MouseIndices } from "./MouseIndices.enum";

export function isPrimaryMouseButtonPressed(mouseState: Int32Array): boolean {
  return mouseState[MouseIndices.M_BUTTON_L] > 0 && mouseState[MouseIndices.M_IN_BOUNDS] > 0;
}
