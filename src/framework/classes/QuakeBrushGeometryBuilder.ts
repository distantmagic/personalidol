import * as THREE from "three";

import { ConvexHull } from "three/examples/jsm/math/ConvexHull";

import quake2three from "../helpers/quake2three";
import three2quake from "../helpers/three2quake";

import { ConvexHull as ConvexHullInterface, Face as ConvexHullFace } from "three/examples/jsm/math/ConvexHull";
import { BufferGeometry, Vector3 } from "three";

import { QuakeBrush } from "../interfaces/QuakeBrush";
import { QuakeBrushGeometryBuilder as QuakeBrushGeometryBuilderInterface } from "../interfaces/QuakeBrushGeometryBuilder";

const TEXTURE_SIZE = 128;

function getConvexHullFacePoints(face: ConvexHullFace): [Vector3, Vector3, Vector3] {
  let edge = face.edge;
  const points = [];

  do {
    const point = edge.head().point;

    edge = edge.next;
    points.push(point);
  } while (edge !== face.edge);

  // unwinded just fo typing
  return [points[0], points[1], points[2]];
}

export default class QuakeBrushGeometryBuilder implements QuakeBrushGeometryBuilderInterface {
  readonly indices: number[];
  readonly normals: number[];
  readonly textureNames: string[];
  readonly textures: number[];
  readonly uvs: number[];
  readonly verticesIndex: WeakMap<
    Vector3,
    {
      index: number;
      normal: Vector3;
    }
  >;
  readonly vertices: number[];
  private lastIndex: number = 0;

  constructor() {
    this.verticesIndex = new WeakMap();

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
    const [v1, v2, v3] = getConvexHullFacePoints(face);
    const halfSpace = quakeBrush.getHalfSpaceByCoplanarPoints(three2quake(v1), three2quake(v2), three2quake(v3));
    const textureName = halfSpace.getTexture();

    this.addVertex(v1, face.normal);
    this.addVertex(v2, face.normal);
    this.addVertex(v3, face.normal);

    if (!this.textureNames.includes(textureName)) {
      this.textureNames.push(textureName);
    }

    const textureIndex = this.textureNames.indexOf(textureName);

    // one per point
    this.addTextureIndex(v1, face.normal, textureIndex);
    this.addTextureIndex(v2, face.normal, textureIndex);
    this.addTextureIndex(v3, face.normal, textureIndex);

    switch (true) {
      case face.normal.x > face.normal.y && face.normal.x > face.normal.z:
        this.addVertexUVs(v1, face.normal, v1.z / TEXTURE_SIZE, v1.y / TEXTURE_SIZE);
        this.addVertexUVs(v2, face.normal, v2.z / TEXTURE_SIZE, v2.y / TEXTURE_SIZE);
        this.addVertexUVs(v3, face.normal, v3.z / TEXTURE_SIZE, v3.y / TEXTURE_SIZE);
        break;
      case face.normal.y > face.normal.x && face.normal.y > face.normal.z:
        this.addVertexUVs(v1, face.normal, v1.z / TEXTURE_SIZE, v1.x / TEXTURE_SIZE);
        this.addVertexUVs(v2, face.normal, v2.z / TEXTURE_SIZE, v2.x / TEXTURE_SIZE);
        this.addVertexUVs(v3, face.normal, v3.z / TEXTURE_SIZE, v3.x / TEXTURE_SIZE);
        break;
      case face.normal.z > face.normal.x && face.normal.z > face.normal.y:
        this.addVertexUVs(v1, face.normal, v1.x / TEXTURE_SIZE, v1.y / TEXTURE_SIZE);
        this.addVertexUVs(v2, face.normal, v2.x / TEXTURE_SIZE, v2.y / TEXTURE_SIZE);
        this.addVertexUVs(v3, face.normal, v3.x / TEXTURE_SIZE, v3.y / TEXTURE_SIZE);
        break;
      case face.normal.x < face.normal.y && face.normal.x < face.normal.z:
        this.addVertexUVs(v1, face.normal, v1.z / TEXTURE_SIZE, v1.y / TEXTURE_SIZE);
        this.addVertexUVs(v2, face.normal, v2.z / TEXTURE_SIZE, v2.y / TEXTURE_SIZE);
        this.addVertexUVs(v3, face.normal, v3.z / TEXTURE_SIZE, v3.y / TEXTURE_SIZE);
        break;
      case face.normal.y < face.normal.x && face.normal.y < face.normal.z:
        this.addVertexUVs(v1, face.normal, v1.z / TEXTURE_SIZE, v1.x / TEXTURE_SIZE);
        this.addVertexUVs(v2, face.normal, v2.z / TEXTURE_SIZE, v2.x / TEXTURE_SIZE);
        this.addVertexUVs(v3, face.normal, v3.z / TEXTURE_SIZE, v3.x / TEXTURE_SIZE);
        break;
      case face.normal.z < face.normal.x && face.normal.z < face.normal.y:
        this.addVertexUVs(v1, face.normal, v1.x / TEXTURE_SIZE, v1.y / TEXTURE_SIZE);
        this.addVertexUVs(v2, face.normal, v2.x / TEXTURE_SIZE, v2.y / TEXTURE_SIZE);
        this.addVertexUVs(v3, face.normal, v3.x / TEXTURE_SIZE, v3.y / TEXTURE_SIZE);
        break;
      default:
        this.addVertexUVs(v1, face.normal, v1.z / TEXTURE_SIZE, v1.x / TEXTURE_SIZE);
        this.addVertexUVs(v2, face.normal, v2.z / TEXTURE_SIZE, v2.x / TEXTURE_SIZE);
        this.addVertexUVs(v3, face.normal, v3.z / TEXTURE_SIZE, v3.x / TEXTURE_SIZE);
        break;
    }

    this.indexVertex(v1, face.normal);
    this.indexVertex(v2, face.normal);
    this.indexVertex(v3, face.normal);
  }

  addTextureIndex(vertex: Vector3, normal: Vector3, textureIndex: number): void {
    if (this.isVertexIndexed(vertex, normal)) {
      return;
    }

    this.textures.push(textureIndex);
  }

  addVertex(vertex: Vector3, normal: Vector3): void {
    if (this.isVertexIndexed(vertex, normal)) {
      return;
    }

    this.normals.push(normal.x, normal.y, normal.z);
    this.vertices.push(vertex.x, vertex.y, vertex.z);
  }

  addVertexUVs(vertex: Vector3, normal: Vector3, x: number, y: number): void {
    if (this.isVertexIndexed(vertex, normal)) {
      return;
    }

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

  getIndices(): ReadonlyArray<number> {
    return this.indices;
  }

  getNormals(): ReadonlyArray<number> {
    return this.normals;
  }

  getTexturesIndices(): ReadonlyArray<number> {
    return this.textures;
  }

  getTexturesNames(): ReadonlyArray<string> {
    return this.textureNames;
  }

  getUvs(): ReadonlyArray<number> {
    return this.uvs;
  }

  getVertices(): ReadonlyArray<number> {
    return this.vertices;
  }

  indexVertex(vertex: Vector3, normal: Vector3): void {
    const indexed = this.verticesIndex.get(vertex);

    if (this.isVertexIndexed(vertex, normal) && indexed) {
      this.indices.push(indexed.index);

      return;
    }

    this.indices.push(this.lastIndex);
    this.verticesIndex.set(vertex, {
      index: this.lastIndex,
      normal: normal,
    });

    this.lastIndex += 1;
  }

  isVertexIndexed(vertex: Vector3, normal: Vector3): boolean {
    const indexed = this.verticesIndex.get(vertex);

    if (!indexed) {
      return false;
    }

    return indexed.normal.equals(normal);
  }
}
