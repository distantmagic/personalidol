// @flow strict

import type { ConvexHull, Face } from "three/examples/jsm/math/ConvexHull";
import type { BufferGeometry, Texture, Vector3 } from "three";

import type { QuakeBrush } from "./QuakeBrush";

export interface QuakeBrushGeometryBuilder {
  addBrush(QuakeBrush, $ReadOnlyArray<Texture>): void;

  addConvexHullFace(QuakeBrush, Face, $ReadOnlyArray<Texture>): void;

  addTextureIndex(vertex: Vector3, normal: Vector3, textureIndex: number): void;

  addVertex(vertex: Vector3, normal: Vector3): void;

  addVertexUVs(vertex: Vector3, normal: Vector3, x: number, y: number): void;

  getConvexHull(QuakeBrush): ConvexHull;

  getGeometry(): BufferGeometry;

  getIndices(): $ReadOnlyArray<number>;

  getNormals(): $ReadOnlyArray<number>;

  getTexturesIndices(): $ReadOnlyArray<number>;

  getTexturesNames(): $ReadOnlyArray<string>;

  getUvs(): $ReadOnlyArray<number>;

  getVertices(): $ReadOnlyArray<number>;

  indexVertex(vertex: Vector3, normal: Vector3): void;

  isVertexIndexed(vertex: Vector3, normal: Vector3): boolean;
}
