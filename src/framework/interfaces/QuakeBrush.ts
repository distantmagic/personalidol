// @flow strict

import type { Vector3 } from "three";

import type { Equatable } from "./Equatable";
import type { QuakeBrushHalfSpace } from "./QuakeBrushHalfSpace";
import type { QuakeBrushHalfSpaceTrio } from "./QuakeBrushHalfSpaceTrio";

export interface QuakeBrush extends Equatable<QuakeBrush> {
  generateHalfSpaceTrios(): Generator<QuakeBrushHalfSpaceTrio, void, void>;

  generateVertices(): Generator<Vector3, void, void>;

  getVertices(): $ReadOnlyArray<Vector3>;

  getHalfSpaceByCoplanarPoints(Vector3, Vector3, Vector3): QuakeBrushHalfSpace;

  getHalfSpaces(): $ReadOnlyArray<QuakeBrushHalfSpace>;

  getTextures(): $ReadOnlyArray<string>;

  containsPoint(Vector3): boolean;
}
