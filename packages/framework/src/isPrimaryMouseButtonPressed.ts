import { InputIndices } from "./InputIndices.enum";

export function isPrimaryMouseButtonPressed(inputState: Int32Array): boolean {
  return inputState[InputIndices.M_BUTTON_L] > 0 && inputState[InputIndices.M_IN_BOUNDS] > 0;
}
