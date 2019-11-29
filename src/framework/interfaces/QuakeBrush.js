// @flow

import type { Vector3 } from "three";

import type { Equatable } from "./Equatable";
import type { QuakeBrushHalfSpace } from "./QuakeBrushHalfSpace";
import type { QuakeBrushHalfSpaceTrio } from "./QuakeBrushHalfSpaceTrio";

export interface QuakeBrush extends Equatable<QuakeBrush> {
  generateHalfSpaceTrios(): Generator<QuakeBrushHalfSpaceTrio, void, void>;

  generateVertices(): Generator<Vector3, void, void>;

  getVertices(): $ReadOnlyArray<Vector3>;

  getHalfSpaces(): $ReadOnlyArray<QuakeBrushHalfSpace>;

  hasPoint(Vector3): boolean;
}
