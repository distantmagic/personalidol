import type { Vector3 } from "three/src/math/Vector3";

function _reduceToLongest(longest: Vector3, current: Vector3): Vector3 {
  if (longest.lengthSq() > current.lengthSq()) {
    return longest;
  }

  return current;
}

export function longestVector3(...vectors: Array<Vector3>): Vector3 {
  if (vectors.length < 1) {
    throw new Error("Expected vectors to compare.");
  }

  return vectors.reduce(_reduceToLongest, vectors[0]);
}
