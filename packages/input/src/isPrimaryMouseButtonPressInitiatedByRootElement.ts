import { MouseIndices } from "./MouseIndices.enum";

export function isPrimaryMouseButtonPressInitiatedByRootElement(mouseState: Int32Array): boolean {
  return Boolean(mouseState[MouseIndices.M_INITIATED_BY_ROOT_ELEMENT]);
}
