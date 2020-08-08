import type { Plane } from "three";
import type { Vector3 } from "three";

export type HalfSpace = {
  coplanarPoints: [Vector3, Vector3, Vector3];
  points: Array<Vector3>;
  plane: Plane;
  texture: {
    name: string;
    offset: {
      x: number;
      y: number;
    };
    rotation: number;
    scale: {
      x: number;
      y: number;
    };
  };
};
