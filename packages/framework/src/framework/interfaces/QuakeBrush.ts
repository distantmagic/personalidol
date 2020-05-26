import type * as THREE from "three";
import type { ConvexHull } from "three/examples/jsm/math/ConvexHull";

import type Equatable from "src/framework/interfaces/Equatable";
import type QuakeBrushHalfSpace from "src/framework/interfaces/QuakeBrushHalfSpace";
import type QuakeBrushHalfSpaceTrio from "src/framework/interfaces/QuakeBrushHalfSpaceTrio";

export default interface QuakeBrush extends Equatable<QuakeBrush> {
  generateHalfSpaceTrios(): Generator<QuakeBrushHalfSpaceTrio>;

  generateVertices(): Generator<THREE.Vector3>;

  getBoundingBox(): THREE.Box3;

  getBoundingSphere(): THREE.Sphere;

  getConvexHull(): ConvexHull;

  getVertices(): ReadonlyArray<THREE.Vector3>;

  getHalfSpaceByCoplanarPoints(v1: THREE.Vector3, v2: THREE.Vector3, v3: THREE.Vector3): QuakeBrushHalfSpace;

  getHalfSpaces(): ReadonlyArray<QuakeBrushHalfSpace>;

  getTextures(): ReadonlyArray<string>;

  containsPoint(point: THREE.Vector3): boolean;
}
