import { Equatable } from "src/framework/interfaces/Equatable";

export default function canCompare(a: Equatable<any>, b: Equatable<any>): boolean {
  if (a === b) {
    return true;
  }

  return b instanceof a.constructor;
}
