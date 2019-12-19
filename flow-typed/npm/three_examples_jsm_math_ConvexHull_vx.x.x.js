import type { Face3, Vector3 } from "three";

declare module "three/examples/jsm/math/ConvexHull" {
  declare export interface ConvexHull {
    +faces: $ReadOnlyArray<Face3>;

    constructor(): void;

    setFromPoints($ReadOnlyArray<Vector3>): ConvexHull;
  }

  declare export interface Face {
    +edge: HalfEdge;
    +midpoint: Vector3;
    +normal: Vector3;
  }

  declare export interface HalfEdge {
    +prev: HalfEdge;
    +next: HalfEdge;
    +twin: HalfEdge;

    head(): VertexNode;
  }

  declare export interface VertexNode {
    +point: Vector3;
  }
}
