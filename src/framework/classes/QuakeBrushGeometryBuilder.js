// @flow

import * as THREE from "three";
import memoize from "lodash/memoize";

import { ConvexHull } from "three/examples/jsm/math/ConvexHull";

import quake2three from "../helpers/quake2three";
import three2quake from "../helpers/three2quake";

import type { ConvexHull as ConvexHullInterface, Face as ConvexHullFace } from "three/examples/jsm/math/ConvexHull";
import type { BufferGeometry, Vector3 } from "three";

import type { QuakeBrush } from "../interfaces/QuakeBrush";
import type { QuakeBrushGeometryBuilder as QuakeBrushGeometryBuilderInterface } from "../interfaces/QuakeBrushGeometryBuilder";

const REGEXP_TEXTURE_NAME = /([0-9]+)x([0-9]+)$/;

function getTextureDimensions(textureName: string): [number, number] {
  const match = textureName.match(REGEXP_TEXTURE_NAME);

  if (!match) {
    return [1024, 1024];
  }

  return [Number(match[1]), Number(match[2])];
}

const getTextureDimensionsMemoized = memoize(getTextureDimensions);

function getTextureHeight(textureName: string): number {
  return getTextureDimensionsMemoized(textureName)[1];
}

function getTextureWidth(textureName: string): number {
  return getTextureDimensionsMemoized(textureName)[0];
}

export default class QuakeBrushGeometryBuilder implements QuakeBrushGeometryBuilderInterface {
  +geometry: BufferGeometry;
  +indices: number[];
  +normals: number[];
  +textureNames: string[];
  +textures: number[];
  +uvs: number[];
  +vertices: number[];

  constructor() {
    this.normals = [];
    this.textureNames = [];
    this.textures = [];
    this.uvs = [];
    this.vertices = [];
    this.indices = [];
  }

  addBrush(quakeBrush: QuakeBrush): void {
    const convexHull = this.getConvexHull(quakeBrush);

    for (let face of convexHull.faces) {
      this.addConvexHullFace(quakeBrush, face);
    }
  }

  addConvexHullFace(quakeBrush: QuakeBrush, face: ConvexHullFace): void {
    const points = [];
    let edge = face.edge;

    do {
      const point = edge.head().point;

      this.addVertex(point);
      this.addNormal(face.normal);
      edge = edge.next;
      points.push(point);
    } while (edge !== face.edge);

    const [v1, v2, v3] = points;

    const halfSpace = quakeBrush.getHalfSpaceByCoplanarPoints(...points.map(three2quake));
    const textureName = halfSpace.getTexture();

    if (!this.textureNames.includes(textureName)) {
      this.textureNames.push(textureName);
    }

    const textureIndex = this.textureNames.indexOf(textureName);
    const textureSideHeight = getTextureHeight(textureName) * halfSpace.getTextureXScale();
    const textureSideWidth = getTextureWidth(textureName) * halfSpace.getTextureYScale();

    // one per point
    this.addTextureIndex(v1, textureIndex);
    this.addTextureIndex(v2, textureIndex);
    this.addTextureIndex(v3, textureIndex);

    // prettier-ignore
    switch (true) {
      case face.normal.x > face.normal.y && face.normal.x > face.normal.z:
        this.addVertexUVs(v1, v1.z / textureSideHeight, v1.y / textureSideWidth);
        this.addVertexUVs(v2, v2.z / textureSideHeight, v2.y / textureSideWidth);
        this.addVertexUVs(v3, v3.z / textureSideHeight, v3.y / textureSideWidth);
        break;
      case face.normal.y > face.normal.x && face.normal.y > face.normal.z:
        this.addVertexUVs(v1, v1.z / textureSideHeight, v1.x / textureSideWidth);
        this.addVertexUVs(v2, v2.z / textureSideHeight, v2.x / textureSideWidth);
        this.addVertexUVs(v3, v3.z / textureSideHeight, v3.x / textureSideWidth);
        break;
      case face.normal.z > face.normal.x && face.normal.z > face.normal.y:
        this.addVertexUVs(v1, v1.x / textureSideHeight, v1.y / textureSideWidth);
        this.addVertexUVs(v2, v2.x / textureSideHeight, v2.y / textureSideWidth);
        this.addVertexUVs(v3, v3.x / textureSideHeight, v3.y / textureSideWidth);
        break;
      case face.normal.x < face.normal.y && face.normal.x < face.normal.z:
        this.addVertexUVs(v1, v1.z / textureSideHeight, v1.y / textureSideWidth);
        this.addVertexUVs(v2, v2.z / textureSideHeight, v2.y / textureSideWidth);
        this.addVertexUVs(v3, v3.z / textureSideHeight, v3.y / textureSideWidth);
        break;
      case face.normal.y < face.normal.x && face.normal.y < face.normal.z:
        this.addVertexUVs(v1, v1.z / textureSideHeight, v1.x / textureSideWidth);
        this.addVertexUVs(v2, v2.z / textureSideHeight, v2.x / textureSideWidth);
        this.addVertexUVs(v3, v3.z / textureSideHeight, v3.x / textureSideWidth);
        break;
      case face.normal.z < face.normal.x && face.normal.z < face.normal.y:
        this.addVertexUVs(v1, v1.x / textureSideHeight, v1.y / textureSideWidth);
        this.addVertexUVs(v2, v2.x / textureSideHeight, v2.y / textureSideWidth);
        this.addVertexUVs(v3, v3.x / textureSideHeight, v3.y / textureSideWidth);
        break;
      default:
        this.addVertexUVs(v1, v1.z / textureSideHeight, v1.x / textureSideWidth);
        this.addVertexUVs(v2, v2.z / textureSideHeight, v2.x / textureSideWidth);
        this.addVertexUVs(v3, v3.z / textureSideHeight, v3.x / textureSideWidth);
        break;
    }
  }

  addNormal(normal: Vector3): void {
    this.normals.push(normal.x, normal.y, normal.z);
  }

  addTextureIndex(vertex: Vector3, textureIndex: number): void {
    this.textures.push(textureIndex);
  }

  addVertex(vertex: Vector3): void {
    this.indices.push(this.indices.length);
    this.vertices.push(vertex.x, vertex.y, vertex.z);
  }

  addVertexUVs(vertex: Vector3, x: number, y: number): void {
    this.uvs.push(x, y);
  }

  getConvexHull(quakeBrush: QuakeBrush): ConvexHullInterface {
    const convexHull = new ConvexHull();
    const vertices = quakeBrush.getVertices().map(quake2three);

    convexHull.setFromPoints(vertices);

    return convexHull;
  }

  getGeometry(): BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(this.getNormals(), 3));
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(this.getVertices(), 3));
    geometry.setAttribute("texture_index", new THREE.Float32BufferAttribute(this.getTexturesIndices(), 1));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(this.getUvs(), 2));

    return geometry;
  }

  getIndices(): $ReadOnlyArray<number> {
    return this.indices;
  }

  getNormals(): $ReadOnlyArray<number> {
    return this.normals;
  }

  getTexturesIndices(): $ReadOnlyArray<number> {
    return this.textures;
  }

  getTexturesNames(): $ReadOnlyArray<string> {
    return this.textureNames;
  }

  getUvs(): $ReadOnlyArray<number> {
    return this.uvs;
  }

  getVertices(): $ReadOnlyArray<number> {
    return this.vertices;
  }
}
