// @flow

import * as THREE from "three";

import { ConvexHull } from "three/examples/jsm/math/ConvexHull";

import quake2three from "../helpers/quake2three";
import three2quake from "../helpers/three2quake";

import type { ConvexHull as ConvexHullInterface } from "three/examples/jsm/math/ConvexHull";
import type { BufferGeometry, Texture } from "three";

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

  getGeometry(textures: $ReadOnlyArray<Texture>): BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const convexHull = this.getConvexHull();

    const vertices = [];
    const normals = [];
    const uvs = [];

    let groupStart = 0;

    for (let face of convexHull.faces) {
      const points = [];
      let edge = face.edge;

      do {
        const point = edge.head().point;
        vertices.push(point.x, point.y, point.z);
        normals.push(face.normal.x, face.normal.y, face.normal.z);
        edge = edge.next;
        points.push(point);
      } while (edge !== face.edge);

      const v1 = points[0];
      const v2 = points[1];
      const v3 = points[2];

      const v1three = three2quake(v1);
      const v2three = three2quake(v2);
      const v3three = three2quake(v3);

      const halfSpace = this.quakeBrush.getHalfSpaceByCopolarPoints(v1three, v2three, v3three);
      const textureName = halfSpace.getTexture();

      const textureIndex = textures.findIndex(texture => texture.name === textureName);
      const texture: Texture = textures[textureIndex];
      const textureSide = texture.image.naturalWidth;

      // prettier-ignore
      if (face.normal.x > face.normal.y && face.normal.x > face.normal.z) {
        uvs.push(
          v1.z / textureSide, v1.y / textureSide,
          v2.z / textureSide, v2.y / textureSide,
          v3.z / textureSide, v3.y / textureSide,
        );
      } else if (face.normal.y > face.normal.x && face.normal.y > face.normal.z) {
        uvs.push(
          v1.z / textureSide, v1.x / textureSide,
          v2.z / textureSide, v2.x / textureSide,
          v3.z / textureSide, v3.x / textureSide,
        );
      } else if (face.normal.z > face.normal.x && face.normal.z > face.normal.y) {
        uvs.push(
          v1.x / textureSide, v1.y / textureSide,
          v2.x / textureSide, v2.y / textureSide,
          v3.x / textureSide, v3.y / textureSide,
        );
      } else if (face.normal.x < face.normal.y && face.normal.x < face.normal.z) {
        uvs.push(
          v1.z / textureSide, v1.y / textureSide,
          v2.z / textureSide, v2.y / textureSide,
          v3.z / textureSide, v3.y / textureSide,
        );
      } else if (face.normal.y < face.normal.x && face.normal.y < face.normal.z) {
        uvs.push(
          v1.z / textureSide, v1.x / textureSide,
          v2.z / textureSide, v2.x / textureSide,
          v3.z / textureSide, v3.x / textureSide,
        );
      } else if (face.normal.z < face.normal.x && face.normal.z < face.normal.y) {
        uvs.push(
          v1.x / textureSide, v1.y / textureSide,
          v2.x / textureSide, v2.y / textureSide,
          v3.x / textureSide, v3.y / textureSide,
        );
      } else {
        uvs.push(
          0, 0,
          0, 0,
          0, 0,
        );
      }

      geometry.addGroup(groupStart, 3, textureIndex);

      groupStart += 3;
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    return geometry;
  }
}
