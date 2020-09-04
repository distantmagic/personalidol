import { Dimensions } from "./Dimensions";
import { Input } from "./Input";

export function computePointerStretchVectorX(dimensionsState: Uint32Array, downInitialClientX: number, currentClientX: number): number {
  return Input.vector_scale * Math.max(-1, Math.min(1, ((currentClientX - downInitialClientX) / dimensionsState[Dimensions.code.D_WIDTH]) * 2));
}
