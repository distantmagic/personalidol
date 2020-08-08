import { Input } from "./Input";

export function isPromaryTouchInDimensionsBounds(dimensionsState: Uint16Array, inputState: Int16Array): boolean {
  return inputState[Input.code.T0_IN_BOUNDS] > 0;
}
