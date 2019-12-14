// @flow

import type { ConvexHull } from "three/examples/jsm/math/ConvexHull";
import type { Geometry, Texture } from "three";

export interface QuakeBrushGeometry {
  getConvexHull(): ConvexHull;

  getGeometry(textures: $ReadOnlyArray<Texture>): Geometry;
}
