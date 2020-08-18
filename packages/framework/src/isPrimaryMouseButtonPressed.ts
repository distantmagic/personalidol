import { Input } from "./Input";

export function isPrimaryMouseButtonPressed(inputState: Int32Array): boolean {
  return inputState[Input.code.M_BUTTON_L] > 0 && inputState[Input.code.M_IN_BOUNDS] > 0;
}
