// @flow

import type { ConvexHull, Face } from "three/examples/jsm/math/ConvexHull";
import type { BufferGeometry, Texture } from "three";

import type { QuakeBrush } from "./QuakeBrush";

export interface QuakeBrushGeometryBuilder {
  addBrush(QuakeBrush, $ReadOnlyArray<Texture>): void;

  addConvexHullFace(QuakeBrush, Face, $ReadOnlyArray<Texture>): void;

  getConvexHull(QuakeBrush): ConvexHull;

  getGeometry(): BufferGeometry;
}