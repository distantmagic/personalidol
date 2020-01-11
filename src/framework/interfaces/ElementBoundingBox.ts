import { ElementPositionUnit } from "../types/ElementPositionUnit";
import { GeometryRectangle } from "./GeometryRectangle";

export interface ElementBoundingBox<Unit extends ElementPositionUnit> extends GeometryRectangle<Unit> {}
