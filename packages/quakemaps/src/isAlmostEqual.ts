export function isAlmostEqual(value: number, compare: number, delta: number = 0.01): boolean {
  return value > compare - delta && value < compare + delta;
}
