import * as THREE from "three";

import QuakeBrushHalfSpace from "src/framework/interfaces/QuakeBrushHalfSpace";

export default interface QuakeBrushHalfSpaceTrio {
  getIntersectingPoint(): THREE.Vector3;

  getQuakeBrushHalfSpace1(): QuakeBrushHalfSpace;

  getQuakeBrushHalfSpace2(): QuakeBrushHalfSpace;

  getQuakeBrushHalfSpace3(): QuakeBrushHalfSpace;

  hasIntersectingPoint(): boolean;
}
