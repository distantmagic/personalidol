// @flow

import * as THREE from "three";

import { ConvexHull } from "three/examples/jsm/math/ConvexHull";

import quake2three from "../helpers/quake2three";
import three2quake from "../helpers/three2quake";

import type { ConvexHull as ConvexHullInterface } from "three/examples/jsm/math/ConvexHull";
import type { Geometry, Texture, Vector2, Vector3 } from "three";

import type { QuakeBrush } from "../interfaces/QuakeBrush";
import type { QuakeBrushGeometry as QuakeBrushGeometryInterface } from "../interfaces/QuakeBrushGeometry";

function generateUVs(face: Face3, textureSide: number, v1: Vector3, v2: Vector3, v3: Vector3): [Vector2, Vector2, Vector2] {
  // prettier-ignore
  if (face.normal.x > face.normal.y && face.normal.x > face.normal.z) {
    return [
      new THREE.Vector2(v1.z / textureSide, v1.y / textureSide),
      new THREE.Vector2(v2.z / textureSide, v2.y / textureSide),
      new THREE.Vector2(v3.z / textureSide, v3.y / textureSide)
    ];
  } else if (face.normal.y > face.normal.x && face.normal.y > face.normal.z) {
    return [
      new THREE.Vector2(v1.z / textureSide, v1.x / textureSide),
      new THREE.Vector2(v2.z / textureSide, v2.x / textureSide),
      new THREE.Vector2(v3.z / textureSide, v3.x / textureSide)
    ];
  } else if (face.normal.z > face.normal.x && face.normal.z > face.normal.y) {
    return [
      new THREE.Vector2(v1.x / textureSide, v1.y / textureSide),
      new THREE.Vector2(v2.x / textureSide, v2.y / textureSide),
      new THREE.Vector2(v3.x / textureSide, v3.y / textureSide)
    ];
  } else if (face.normal.x < face.normal.y && face.normal.x < face.normal.z) {
    return [
      new THREE.Vector2(v1.z / textureSide, v1.y / textureSide),
      new THREE.Vector2(v2.z / textureSide, v2.y / textureSide),
      new THREE.Vector2(v3.z / textureSide, v3.y / textureSide)
    ];
  } else if (face.normal.y < face.normal.x && face.normal.y < face.normal.z) {
    return [
      new THREE.Vector2(v1.z / textureSide, v1.x / textureSide),
      new THREE.Vector2(v2.z / textureSide, v2.x / textureSide),
      new THREE.Vector2(v3.z / textureSide, v3.x / textureSide)
    ];
  } else if (face.normal.z < face.normal.x && face.normal.z < face.normal.y) {
    return [
      new THREE.Vector2(v1.x / textureSide, v1.y / textureSide),
      new THREE.Vector2(v2.x / textureSide, v2.y / textureSide),
      new THREE.Vector2(v3.x / textureSide, v3.y / textureSide)
    ];
  } else {
    return [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0, 0)
    ];
  }
}

export default class QuakeBrushGeometry implements QuakeBrushGeometryInterface {
  +quakeBrush: QuakeBrush;

  constructor(quakeBrush: QuakeBrush) {
    this.quakeBrush = quakeBrush;
  }

  getConvexHull(): ConvexHullInterface {
    const convexHull = new ConvexHull();
    const vertices = this.quakeBrush.getVertices().map(quake2three);

    convexHull.setFromPoints(vertices);

    return convexHull;
  }

  getGeometry(textures: $ReadOnlyArray<Texture>): Geometry {
    const geometry = new THREE.Geometry();
    const convexHull = this.getConvexHull();

    let i = 0;
    for (let rawFace of convexHull.faces) {
      let edge = rawFace.edge;

      do {
        let point = edge.head().point;
        geometry.vertices.push(point);
        edge = edge.next;
      } while (edge !== rawFace.edge);

      const v1 = geometry.vertices[i];
      const v2 = geometry.vertices[i + 1];
      const v3 = geometry.vertices[i + 2];

      const halfSpace = this.quakeBrush.getHalfSpaceByCopolarPoints(
        three2quake(v1),
        three2quake(v2),
        three2quake(v3),
      );
      const textureName = halfSpace.getTexture();

      const textureIndex = textures.findIndex(texture => texture.name === textureName);
      const texture: Texture = textures[textureIndex];
      const textureSide = texture.image.naturalWidth;
      const face = new THREE.Face3(i, i + 1, i + 2, rawFace.normal, rawFace.color, textureIndex);

      geometry.faceVertexUvs[0].push(generateUVs(face, textureSide, v1, v2, v3));

      geometry.faces.push(face);
      i += 3;
    }

    return geometry;
  }
}
