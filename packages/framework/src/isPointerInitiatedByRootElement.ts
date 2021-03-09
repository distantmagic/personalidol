import { MouseIndices } from "./MouseIndices.enum";
import { TouchIndices } from "./TouchIndices.enum";

export function isPointerInitiatedByRootElement(mouseState: Int32Array, touchState: Int32Array): boolean {
  if (mouseState[MouseIndices.M_LAST_USED] > touchState[TouchIndices.T_LAST_USED]) {
    return Boolean(mouseState[MouseIndices.M_INITIATED_BY_ROOT_ELEMENT]);
  }

  return Boolean(touchState[TouchIndices.T_INITIATED_BY_ROOT_ELEMENT]);
}
