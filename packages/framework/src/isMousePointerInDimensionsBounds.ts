import { Input } from "./Input";

export function isMousePointerInDimensionsBounds(dimensionsState: Uint32Array, inputState: Int32Array): boolean {
  return inputState[Input.code.M_IN_BOUNDS] > 0;
}
