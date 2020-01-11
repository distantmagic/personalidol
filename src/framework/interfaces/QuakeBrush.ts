import { Vector3 } from "three";

import { Equatable } from "./Equatable";
import { QuakeBrushHalfSpace } from "./QuakeBrushHalfSpace";
import { QuakeBrushHalfSpaceTrio } from "./QuakeBrushHalfSpaceTrio";

export interface QuakeBrush extends Equatable<QuakeBrush> {
  generateHalfSpaceTrios(): Generator<QuakeBrushHalfSpaceTrio, void, void>;

  generateVertices(): Generator<Vector3, void, void>;

  getVertices(): ReadonlyArray<Vector3>;

  getHalfSpaceByCoplanarPoints(v1: Vector3, v2: Vector3, v3: Vector3): QuakeBrushHalfSpace;

  getHalfSpaces(): ReadonlyArray<QuakeBrushHalfSpace>;

  getTextures(): ReadonlyArray<string>;

  containsPoint(point: Vector3): boolean;
}
