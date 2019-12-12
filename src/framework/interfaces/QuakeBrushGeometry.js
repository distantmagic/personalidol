// @flow

import type { ConvexHull } from "three/examples/jsm/math/ConvexHull";
import type { Geometry } from "three";

export interface QuakeBrushGeometry {
  getConvexHull(): ConvexHull;

  getGeometry(textures: $ReadOnlyArray<string>): Geometry;
}
