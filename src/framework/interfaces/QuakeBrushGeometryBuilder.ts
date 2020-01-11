import { ConvexHull, Face } from "three/examples/jsm/math/ConvexHull";
import { BufferGeometry, Texture, Vector3 } from "three";

import { QuakeBrush } from "./QuakeBrush";

export interface QuakeBrushGeometryBuilder {
  addBrush(brush: QuakeBrush, textures: ReadonlyArray<Texture>): void;

  addConvexHullFace(brush: QuakeBrush, face: Face, textures: ReadonlyArray<Texture>): void;

  addTextureIndex(vertex: Vector3, normal: Vector3, textureIndex: number): void;

  addVertex(vertex: Vector3, normal: Vector3): void;

  addVertexUVs(vertex: Vector3, normal: Vector3, x: number, y: number): void;

  getConvexHull(brush: QuakeBrush): ConvexHull;

  getGeometry(): BufferGeometry;

  getIndices(): ReadonlyArray<number>;

  getNormals(): ReadonlyArray<number>;

  getTexturesIndices(): ReadonlyArray<number>;

  getTexturesNames(): ReadonlyArray<string>;

  getUvs(): ReadonlyArray<number>;

  getVertices(): ReadonlyArray<number>;

  indexVertex(vertex: Vector3, normal: Vector3): void;

  isVertexIndexed(vertex: Vector3, normal: Vector3): boolean;
}
