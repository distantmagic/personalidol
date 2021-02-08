import { InputIndices } from "./InputIndices.enum";

export function getPrimaryPointerClientX(inputState: Int32Array): number {
  if (inputState[InputIndices.M_LAST_USED] > inputState[InputIndices.T_LAST_USED]) {
    return inputState[InputIndices.M_CLIENT_X];
  }

  return inputState[InputIndices.T0_CLIENT_X];
}
