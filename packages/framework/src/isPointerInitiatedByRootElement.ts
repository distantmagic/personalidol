import { InputIndices } from "./InputIndices.enum";

export function isPointerInitiatedByRootElement(inputState: Int32Array): boolean {
  if (inputState[InputIndices.M_LAST_USED] > inputState[InputIndices.T_LAST_USED]) {
    return Boolean(inputState[InputIndices.M_INITIATED_BY_ROOT_ELEMENT]);
  }

  return Boolean(inputState[InputIndices.T_INITIATED_BY_ROOT_ELEMENT]);
}
