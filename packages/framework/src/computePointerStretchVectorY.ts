import { Dimensions } from "./Dimensions";
import { Input } from "./Input";

export function computePointerStretchVectorY(dimensionsState: Uint32Array, downInitialClientY: number, currentClientY: number): number {
  return Input.vector_scale * Math.max(-1, Math.min(1, ((downInitialClientY - currentClientY) / dimensionsState[Dimensions.code.D_HEIGHT]) * 2));
}
