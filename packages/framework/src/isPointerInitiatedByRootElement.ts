import { PointerIndices } from "./PointerIndices.enum";

export function isPointerInitiatedByRootElement(pointerState: Int32Array): boolean {
  if (pointerState[PointerIndices.M_LAST_USED] > pointerState[PointerIndices.T_LAST_USED]) {
    return Boolean(pointerState[PointerIndices.M_INITIATED_BY_ROOT_ELEMENT]);
  }

  return Boolean(pointerState[PointerIndices.T_INITIATED_BY_ROOT_ELEMENT]);
}
