import { TouchIndices } from "./TouchIndices.enum";

export function isPrimaryTouchInitiatedByRootElement(touchState: Int32Array): boolean {
  return Boolean(touchState[TouchIndices.T_INITIATED_BY_ROOT_ELEMENT]);
}
