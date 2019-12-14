// @flow

import * as THREE from "three";

import { ConvexHull } from "three/examples/jsm/math/ConvexHull";

import quake2three from "../helpers/quake2three";
import three2quake from "../helpers/three2quake";

import type { ConvexHull as ConvexHullInterface } from "three/examples/jsm/math/ConvexHull";
import type { Geometry, Texture } from "three";

import type { QuakeBrush } from "../interfaces/QuakeBrush";
import type { QuakeBrushGeometry as QuakeBrushGeometryInterface } from "../interfaces/QuakeBrushGeometry";

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

      const v1three = three2quake(v1);
      const v2three = three2quake(v2);
      const v3three = three2quake(v3);

      const halfSpace = this.quakeBrush.getHalfSpaceByCopolarPoints(v1three, v2three, v3three);
      const textureName = halfSpace.getTexture();

      const textureIndex = textures.findIndex(texture => texture.name === textureName);
      const texture: Texture = textures[textureIndex];
      const textureSide = texture.image.naturalWidth;
      const face = new THREE.Face3(i, i + 1, i + 2, rawFace.normal, rawFace.color, textureIndex);

      // prettier-ignore
      if (face.normal.x > face.normal.y && face.normal.x > face.normal.z) {
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(v1.z / textureSide, v1.y / textureSide),
          new THREE.Vector2(v2.z / textureSide, v2.y / textureSide),
          new THREE.Vector2(v3.z / textureSide, v3.y / textureSide)
        ]);
      } else if (face.normal.y > face.normal.x && face.normal.y > face.normal.z) {
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(v1.z / textureSide, v1.x / textureSide),
          new THREE.Vector2(v2.z / textureSide, v2.x / textureSide),
          new THREE.Vector2(v3.z / textureSide, v3.x / textureSide)
        ]);
      } else if (face.normal.z > face.normal.x && face.normal.z > face.normal.y) {
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(v1.x / textureSide, v1.y / textureSide),
          new THREE.Vector2(v2.x / textureSide, v2.y / textureSide),
          new THREE.Vector2(v3.x / textureSide, v3.y / textureSide)
        ]);
      } else if (face.normal.x < face.normal.y && face.normal.x < face.normal.z) {
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(v1.z / textureSide, v1.y / textureSide),
          new THREE.Vector2(v2.z / textureSide, v2.y / textureSide),
          new THREE.Vector2(v3.z / textureSide, v3.y / textureSide)
        ]);
      } else if (face.normal.y < face.normal.x && face.normal.y < face.normal.z) {
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(v1.z / textureSide, v1.x / textureSide),
          new THREE.Vector2(v2.z / textureSide, v2.x / textureSide),
          new THREE.Vector2(v3.z / textureSide, v3.x / textureSide)
        ]);
      } else if (face.normal.z < face.normal.x && face.normal.z < face.normal.y) {
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(v1.x / textureSide, v1.y / textureSide),
          new THREE.Vector2(v2.x / textureSide, v2.y / textureSide),
          new THREE.Vector2(v3.x / textureSide, v3.y / textureSide)
        ]);
      } else {
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0, 0)
        ]);
      }

      geometry.faces.push(face);
      i += 3;
    }

    return geometry;
  }
}
