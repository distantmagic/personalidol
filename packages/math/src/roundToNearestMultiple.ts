export function roundToNearestMultiple(multiple: number, val: number): number {
  const rest = val % multiple;
  if (rest <= multiple / 2) {
    return val - rest;
  }

  return val + multiple - rest;
}
