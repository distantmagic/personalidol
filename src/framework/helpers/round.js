// @flow

function shiftPrecision(n: number, precision: number): number {
  const [base: string, exp: ?string] = n.toString().split("e");

  return Number(base + "e" + (exp ? Number(exp) + precision : precision));
}

export function roundWithPrecision(n: number, precision: number): number {
  if (precision > 0) {
    throw new RangeError("Rounding with precision greater than zero is not allowed.");
  }

  const shifted = Math.round(shiftPrecision(n, -1 * precision));

  // shift back
  return shiftPrecision(shifted, precision);
}

export function isEqualWithPrecision(n1: number, n2: number, precision: number): boolean {
  return roundWithPrecision(n1, precision) === roundWithPrecision(n2, precision);
}
