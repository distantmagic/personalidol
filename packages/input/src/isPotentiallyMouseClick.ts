import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { MouseIndices } from "./MouseIndices.enum";

export function isPotentiallyMouseClick(mouseState: Int32Array): boolean {
  if (!isPrimaryMouseButtonPressed(mouseState)) {
    return false;
  }

  return mouseState[MouseIndices.M_DOWN_TRAVEL_DISTANCE] < 5;
}
