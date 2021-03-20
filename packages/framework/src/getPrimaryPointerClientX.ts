import { MouseIndices } from "./MouseIndices.enum";
import { TouchIndices } from "./TouchIndices.enum";

export function getPrimaryPointerClientX(mouseState: Int32Array, touchState: Int32Array): number {
  if (mouseState[MouseIndices.M_LAST_USED] > touchState[TouchIndices.T_LAST_USED]) {
    return mouseState[MouseIndices.M_CLIENT_X];
  }

  return touchState[TouchIndices.T0_CLIENT_X];
}
