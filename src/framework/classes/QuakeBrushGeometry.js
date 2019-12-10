// @flow

import * as THREE from "three";

import { ConvexHull } from "three/examples/jsm/math/ConvexHull";

import quake2three from "../helpers/quake2three";

import type { Geometry, Face3 } from "three";

import type { QuakeBrush } from "../interfaces/QuakeBrush";
import type { QuakeBrushGeometry as QuakeBrushGeometryInterface } from "../interfaces/QuakeBrushGeometry";

function assignUVs(geometry) {
    geometry.faceVertexUvs[0] = [];
    geometry.faces.forEach(function(face) {
        var components = ['x', 'y', 'z'].sort(function(a, b) {
            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
        });

        var v1 = geometry.vertices[face.a];
        var v2 = geometry.vertices[face.b];
        var v3 = geometry.vertices[face.c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);

    });
    geometry.uvsNeedUpdate = true;
}

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

    // console.log(geometry.faceVertexUvs);

    let i = 0;
    for (let face of convexHull.faces) {
      let edge = face.edge;

      // we move along a doubly-connected edge list to access all face points (see HalfEdge docs)

      do {

        let point = edge.head().point;

        geometry.vertices.push(point);

        // console.log(i, point);
        // for (let halfSpace of this.quakeBrush.getHalfSpaces()) {
        //   if (halfSpace.planeContainsPoint(point)) {
        //     console.log(i, ":D");
        //   }
        // }

        // vertices.push( point.x, point.y, point.z );
        // normals.push( face.normal.x, face.normal.y, face.normal.z );

        edge = edge.next;

      } while ( edge !== face.edge );
      // console.log(face.edge.head().point);
      // yield face;

      const fixedFace = new THREE.Face3(i, i + 1, i + 2, face.normal, face.color, 0);

      geometry.faces.push(fixedFace);
      i += 3;
    }

    assignUVs(geometry);

    return geometry;
  }
}
