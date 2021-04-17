import type { Brush } from "./Brush.type";
import type { HalfSpace } from "./HalfSpace.type";
import type { TriangleSimple } from "./TriangleSimple.type";

export type BrushHalfSpaceTriangle = {
  brush: Brush;
  halfSpace: HalfSpace;
  triangle: TriangleSimple;
};
