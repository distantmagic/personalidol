// @flow

import * as THREE from "three";

import { ConvexHull } from "three/examples/jsm/math/ConvexHull";

import quake2three from "../helpers/quake2three";

import type { Geometry } from "three";

import type { QuakeBrush } from "../interfaces/QuakeBrush";
import type { QuakeBrushGeometry as QuakeBrushGeometryInterface } from "../interfaces/QuakeBrushGeometry";

export default class QuakeBrushGeometry implements QuakeBrushGeometryInterface {
  +quakeBrush: QuakeBrush;

  constructor(quakeBrush: QuakeBrush) {
    this.quakeBrush = quakeBrush;
  }

  getGeometry(): Geometry {
    const geometry = new THREE.Geometry();
    const convexHull = new ConvexHull();
    const vertices = this.quakeBrush.getVertices().map(quake2three);

    convexHull.setFromPoints(vertices);

    let i = 0;
    for (let rawFace of convexHull.faces) {
      let edge = rawFace.edge;

      do {
        let point = edge.head().point;
        geometry.vertices.push(point);
        edge = edge.next;
      } while (edge !== rawFace.edge);

      const face = new THREE.Face3(i, i + 1, i + 2, rawFace.normal, rawFace.color, 0);
      const v1 = geometry.vertices[face.a];
      const v2 = geometry.vertices[face.b];
      const v3 = geometry.vertices[face.c];

      if (face.normal.x > face.normal.y && face.normal.x > face.normal.z) {
        geometry.faceVertexUvs[0].push([new THREE.Vector2(v1.z / 1024, v1.y / 1024), new THREE.Vector2(v2.z / 1024, v2.y / 1024), new THREE.Vector2(v3.z / 1024, v3.y / 1024)]);
      } else if (face.normal.y > face.normal.x && face.normal.y > face.normal.z) {
        geometry.faceVertexUvs[0].push([new THREE.Vector2(v1.z / 1024, v1.x / 1024), new THREE.Vector2(v2.z / 1024, v2.x / 1024), new THREE.Vector2(v3.z / 1024, v3.x / 1024)]);
      } else if (face.normal.z > face.normal.x && face.normal.z > face.normal.y) {
        geometry.faceVertexUvs[0].push([new THREE.Vector2(v1.x / 1024, v1.y / 1024), new THREE.Vector2(v2.x / 1024, v2.y / 1024), new THREE.Vector2(v3.x / 1024, v3.y / 1024)]);
      } else if (face.normal.x < face.normal.y && face.normal.x < face.normal.z) {
        geometry.faceVertexUvs[0].push([new THREE.Vector2(v1.z / 1024, v1.y / 1024), new THREE.Vector2(v2.z / 1024, v2.y / 1024), new THREE.Vector2(v3.z / 1024, v3.y / 1024)]);
      } else if (face.normal.y < face.normal.x && face.normal.y < face.normal.z) {
        geometry.faceVertexUvs[0].push([new THREE.Vector2(v1.z / 1024, v1.x / 1024), new THREE.Vector2(v2.z / 1024, v2.x / 1024), new THREE.Vector2(v3.z / 1024, v3.x / 1024)]);
      } else if (face.normal.z < face.normal.x && face.normal.z < face.normal.y) {
        geometry.faceVertexUvs[0].push([new THREE.Vector2(v1.x / 1024, v1.y / 1024), new THREE.Vector2(v2.x / 1024, v2.y / 1024), new THREE.Vector2(v3.x / 1024, v3.y / 1024)]);
      } else {
        geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)]);
      }

      geometry.faces.push(face);
      i += 3;
    }

    return geometry;
  }
}
