import { MouseIndices } from "./MouseIndices.enum";
import { TouchIndices } from "./TouchIndices.enum";

export function getPrimaryPointerInitialClientY(mouseState: Int32Array, touchState: Int32Array): number {
  if (mouseState[MouseIndices.M_LAST_USED] > touchState[TouchIndices.T_LAST_USED]) {
    return mouseState[MouseIndices.M_DOWN_INITIAL_CLIENT_Y];
  }

  return touchState[TouchIndices.T0_DOWN_INITIAL_CLIENT_Y];
}
