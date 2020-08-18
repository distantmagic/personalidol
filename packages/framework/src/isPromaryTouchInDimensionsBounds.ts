import { Input } from "./Input";

export function isPromaryTouchInDimensionsBounds(dimensionsState: Uint32Array, inputState: Int32Array): boolean {
  return inputState[Input.code.T0_IN_BOUNDS] > 0;
}
