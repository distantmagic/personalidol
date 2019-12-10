import type { Face3, Vector3 } from "three";

declare module "three/examples/jsm/math/ConvexHull" {
  declare export interface ConvexHull {
    +faces: $ReadOnlyArray<Face3>;

    constructor(): void;

    setFromPoints($ReadOnlyArray<Vector3>): ConvexHull;
  }
}
