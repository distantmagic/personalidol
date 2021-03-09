export function computePointerStretchVectorY(dimensionsState: Uint32Array, downInitialClientY: number, currentClientY: number, scale: number): number {
  return scale * Math.max(-1, Math.min(1, ((downInitialClientY - currentClientY) / 200) * 2));
}
