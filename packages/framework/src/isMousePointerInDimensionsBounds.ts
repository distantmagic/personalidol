import { Input } from "./Input";

export function isMousePointerInDimensionsBounds(dimensionsState: Uint16Array, inputState: Int16Array): boolean {
  return inputState[Input.code.M_IN_BOUNDS] > 0;
}
