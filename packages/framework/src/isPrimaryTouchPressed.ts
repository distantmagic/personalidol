import { Input } from "./Input";

export function isPrimaryTouchPressed(inputState: Int32Array): boolean {
  return inputState[Input.code.T0_PRESSURE] > 0 && inputState[Input.code.T0_IN_BOUNDS] > 0;
}
