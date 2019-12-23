// @flow

import * as THREE from "three";

import { ConvexHull } from "three/examples/jsm/math/ConvexHull";

import quake2three from "../helpers/quake2three";
import three2quake from "../helpers/three2quake";

import type { ConvexHull as ConvexHullInterface, Face as ConvexHullFace } from "three/examples/jsm/math/ConvexHull";
import type { BufferGeometry, Texture } from "three";

import type { QuakeBrush } from "../interfaces/QuakeBrush";
import type { QuakeBrushGeometryBuilder as QuakeBrushGeometryBuilderInterface } from "../interfaces/QuakeBrushGeometryBuilder";

export default class QuakeBrushGeometryBuilder implements QuakeBrushGeometryBuilderInterface {
  +geometry: BufferGeometry;
  +normals: number[];
  +textures: number[];
  +uvs: number[];
  +vertices: number[];
  groupStart: number;

  constructor() {
    this.geometry = new THREE.BufferGeometry();
    this.groupStart = 0;
    this.normals = [];
    this.textures = [];
    this.uvs = [];
    this.vertices = [];
  }

  addBrush(quakeBrush: QuakeBrush, textures: $ReadOnlyArray<Texture>): void {
    const convexHull = this.getConvexHull(quakeBrush);

    for (let face of convexHull.faces) {
      this.addConvexHullFace(quakeBrush, face, textures);
    }
  }

  addConvexHullFace(quakeBrush: QuakeBrush, face: ConvexHullFace, textures: $ReadOnlyArray<Texture>): void {
    const points = [];
    let edge = face.edge;

    do {
      const point = edge.head().point;

      this.vertices.push(point.x, point.y, point.z);
      this.normals.push(face.normal.x, face.normal.y, face.normal.z);
      edge = edge.next;
      points.push(point);
    } while (edge !== face.edge);

    const [v1, v2, v3] = points;

    const halfSpace = quakeBrush.getHalfSpaceByCoplanarPoints(...points.map(three2quake));
    const textureName = halfSpace.getTexture();

    // const textureIndex = textures.findIndex(texture => texture.name === textureName);
    // const texture: Texture = textures[textureIndex];
    // const textureSideHeight = texture.image.naturalHeight * halfSpace.getTextureXScale();
    // const textureSideWidth = texture.image.naturalWidth * halfSpace.getTextureYScale();
    const textureIndex = 0;
    const textureSideWidth = 1024;
    const textureSideHeight = 1024;

    // one per point
    this.textures.push(textureIndex, textureIndex, textureIndex);

    // prettier-ignore
    switch (true) {
      case face.normal.x > face.normal.y && face.normal.x > face.normal.z:
        this.uvs.push(
          v1.z / textureSideHeight, v1.y / textureSideWidth,
          v2.z / textureSideHeight, v2.y / textureSideWidth,
          v3.z / textureSideHeight, v3.y / textureSideWidth,
        );
        break;
      case face.normal.y > face.normal.x && face.normal.y > face.normal.z:
        this.uvs.push(
          v1.z / textureSideHeight, v1.x / textureSideWidth,
          v2.z / textureSideHeight, v2.x / textureSideWidth,
          v3.z / textureSideHeight, v3.x / textureSideWidth,
        );
        break;
      case face.normal.z > face.normal.x && face.normal.z > face.normal.y:
        this.uvs.push(
          v1.x / textureSideHeight, v1.y / textureSideWidth,
          v2.x / textureSideHeight, v2.y / textureSideWidth,
          v3.x / textureSideHeight, v3.y / textureSideWidth,
        );
        break;
      case face.normal.x < face.normal.y && face.normal.x < face.normal.z:
        this.uvs.push(
          v1.z / textureSideHeight, v1.y / textureSideWidth,
          v2.z / textureSideHeight, v2.y / textureSideWidth,
          v3.z / textureSideHeight, v3.y / textureSideWidth,
        );
        break;
      case face.normal.y < face.normal.x && face.normal.y < face.normal.z:
        this.uvs.push(
          v1.z / textureSideHeight, v1.x / textureSideWidth,
          v2.z / textureSideHeight, v2.x / textureSideWidth,
          v3.z / textureSideHeight, v3.x / textureSideWidth,
        );
        break;
      case face.normal.z < face.normal.x && face.normal.z < face.normal.y:
        this.uvs.push(
          v1.x / textureSideHeight, v1.y / textureSideWidth,
          v2.x / textureSideHeight, v2.y / textureSideWidth,
          v3.x / textureSideHeight, v3.y / textureSideWidth,
        );
        break;
      default:
        this.uvs.push(
          v1.z / textureSideHeight, v1.x / textureSideWidth,
          v2.z / textureSideHeight, v2.x / textureSideWidth,
          v3.z / textureSideHeight, v3.x / textureSideWidth,
        );
        break;
    }

    this.geometry.addGroup(this.groupStart, 3, textureIndex);
    this.groupStart += 3;
  }

  getConvexHull(quakeBrush: QuakeBrush): ConvexHullInterface {
    const convexHull = new ConvexHull();
    const vertices = quakeBrush.getVertices().map(quake2three);

    convexHull.setFromPoints(vertices);

    return convexHull;
  }

  getGeometry(): BufferGeometry {
    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(this.vertices, 3));
    this.geometry.setAttribute("normal", new THREE.Float32BufferAttribute(this.normals, 3));
    this.geometry.setAttribute("uv", new THREE.Float32BufferAttribute(this.uvs, 2));
    this.geometry.setAttribute("a_textureIndex", new THREE.Float32BufferAttribute(this.textures, 1));

    return this.geometry;
  }
}
