import { ElementPositionUnit } from "src/framework/types/ElementPositionUnit";
import { GeometryRectangle } from "src/framework/interfaces/GeometryRectangle";

export interface ElementBoundingBox<Unit extends ElementPositionUnit> extends GeometryRectangle<Unit> {}
