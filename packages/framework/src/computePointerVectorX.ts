import { Dimensions } from "./Dimensions";
import { Input } from "./Input";

export function computePointerVectorX(dimensionsState: Uint16Array, relativeX: number): number {
  return Input.vector_scale * ((relativeX / dimensionsState[Dimensions.code.D_WIDTH]) * 2 - 1);
}
