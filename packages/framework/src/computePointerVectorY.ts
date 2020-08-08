import { Dimensions } from "./Dimensions";
import { Input } from "./Input";

export function computePointerVectorY(dimensionsState: Uint16Array, relativeY: number): number {
  return Input.vector_scale * (-1 * (relativeY / dimensionsState[Dimensions.code.D_HEIGHT]) * 2 + 1);
}
