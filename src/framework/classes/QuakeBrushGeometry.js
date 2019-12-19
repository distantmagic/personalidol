// @flow

import * as THREE from "three";

import { ConvexHull } from "three/examples/jsm/math/ConvexHull";

import quake2three from "../helpers/quake2three";
import serializeVector3 from "../helpers/serializeVector3";
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
        const serializedPoint = serializeVector3(point);

        vertices.push(point.x, point.y, point.z);
        normals.push(face.normal.x, face.normal.y, face.normal.z);
        edge = edge.next;
        points.push(point);
      } while (edge !== face.edge);

      const [v1, v2, v3] = points;

      const halfSpace = this.quakeBrush.getHalfSpaceByCoplanarPoints(...points.map(three2quake));
      const textureName = halfSpace.getTexture();

      const textureIndex = textures.findIndex(texture => texture.name === textureName);
      const texture: Texture = textures[textureIndex];
      const textureSideHeight = texture.image.naturalHeight * halfSpace.getTextureXScale();
      const textureSideWidth = texture.image.naturalWidth * halfSpace.getTextureYScale();

      // prettier-ignore
      switch (true) {
        case face.normal.x > face.normal.y && face.normal.x > face.normal.z:
          uvs.push(
            v1.z / textureSideHeight, v1.y / textureSideWidth,
            v2.z / textureSideHeight, v2.y / textureSideWidth,
            v3.z / textureSideHeight, v3.y / textureSideWidth,
          );
          break;
        case face.normal.y > face.normal.x && face.normal.y > face.normal.z:
          uvs.push(
            v1.z / textureSideHeight, v1.x / textureSideWidth,
            v2.z / textureSideHeight, v2.x / textureSideWidth,
            v3.z / textureSideHeight, v3.x / textureSideWidth,
          );
          break;
        case face.normal.z > face.normal.x && face.normal.z > face.normal.y:
          uvs.push(
            v1.x / textureSideHeight, v1.y / textureSideWidth,
            v2.x / textureSideHeight, v2.y / textureSideWidth,
            v3.x / textureSideHeight, v3.y / textureSideWidth,
          );
          break;
        case face.normal.x < face.normal.y && face.normal.x < face.normal.z:
          uvs.push(
            v1.z / textureSideHeight, v1.y / textureSideWidth,
            v2.z / textureSideHeight, v2.y / textureSideWidth,
            v3.z / textureSideHeight, v3.y / textureSideWidth,
          );
          break;
        case face.normal.y < face.normal.x && face.normal.y < face.normal.z:
          uvs.push(
            v1.z / textureSideHeight, v1.x / textureSideWidth,
            v2.z / textureSideHeight, v2.x / textureSideWidth,
            v3.z / textureSideHeight, v3.x / textureSideWidth,
          );
          break;
        case face.normal.z < face.normal.x && face.normal.z < face.normal.y:
          uvs.push(
            v1.x / textureSideHeight, v1.y / textureSideWidth,
            v2.x / textureSideHeight, v2.y / textureSideWidth,
            v3.x / textureSideHeight, v3.y / textureSideWidth,
          );
          break;
        default:
          uvs.push(
            v1.z / textureSideHeight, v1.x / textureSideWidth,
            v2.z / textureSideHeight, v2.x / textureSideWidth,
            v3.z / textureSideHeight, v3.x / textureSideWidth,
          );
          break;
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
