import { Input } from "./Input";

export function computePointerStretchVectorX(dimensionsState: Uint32Array, downInitialClientX: number, currentClientX: number): number {
  return Input.vector_scale * Math.max(-1, Math.min(1, ((currentClientX - downInitialClientX) / 100) * 2));
}
