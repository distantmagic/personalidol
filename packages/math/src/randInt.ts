export function randInt(low: number, high: number): number {
  return low + Math.floor(Math.random() * (high - low + 1));
}
