// @flow strict

import type { Vector3 } from "three";

import type { QuakeBrushHalfSpace } from "./QuakeBrushHalfSpace";

export interface QuakeBrushHalfSpaceTrio {
  getIntersectingPoint(): Vector3;

  getQuakeBrushHalfSpace1(): QuakeBrushHalfSpace;

  getQuakeBrushHalfSpace2(): QuakeBrushHalfSpace;

  getQuakeBrushHalfSpace3(): QuakeBrushHalfSpace;

  hasIntersectingPoint(): boolean;
}
