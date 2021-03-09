export function computePointerStretchVectorX(dimensionsState: Uint32Array, downInitialClientX: number, currentClientX: number, scale: number): number {
  return scale * Math.max(-1, Math.min(1, ((currentClientX - downInitialClientX) / 100) * 2));
}
