export function lerp(x: number, y: number, t: number): number {
  return (1 - t) * x + t * y;
}
