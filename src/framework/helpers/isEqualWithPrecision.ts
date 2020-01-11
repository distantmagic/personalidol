import * as math from "mathjs";

export default function isEqualWithPrecision(n1: number, n2: number, precision: number): boolean {
  return math.round(n1, precision) === math.round(n2, precision);
}
