// @flow

import type { ConvexHull } from "three/examples/jsm/math/ConvexHull";
import type { BufferGeometry, Texture } from "three";

export interface QuakeBrushGeometry {
  getConvexHull(): ConvexHull;

  getGeometry(textures: $ReadOnlyArray<Texture>): BufferGeometry;
}
