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
    for (let face of convexHull.faces) {
      let edge = face.edge;

      do {
        let point = edge.head().point;
        geometry.vertices.push(point);
        edge = edge.next;
      } while ( edge !== face.edge );

      geometry.faces.push(new THREE.Face3(
        i,
        i + 1,
        i + 2,
        face.normal,
        face.color,
        0
      ));

      i += 3;
    }

    geometry.faceVertexUvs[0] = [];
    geometry.faces.forEach(function(face) {
      var components = ['x', 'y', 'z'].sort(function(a, b) {
        return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
      });

      var v1 = geometry.vertices[face.a];
      var v2 = geometry.vertices[face.b];
      var v3 = geometry.vertices[face.c];

      // dv->st[0] = s->vecs[0][3] + DotProduct( s->vecs[0], dv->xyz );
      // dv->st[1] = s->vecs[1][3] + DotProduct( s->vecs[1], dv->xyz );

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2(v1[components[0]] / 1024, v1[components[1]] / 1024),
        new THREE.Vector2(v2[components[0]] / 1024, v2[components[1]] / 1024),
        new THREE.Vector2(v3[components[0]] / 1024, v3[components[1]] / 1024),
      ]);
    });

    return geometry;
  }
}
