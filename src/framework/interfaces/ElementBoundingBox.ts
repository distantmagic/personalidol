import GeometryRectangle from "src/framework/interfaces/GeometryRectangle";

import ElementPositionUnit from "src/framework/types/ElementPositionUnit";

export default interface ElementBoundingBox<Unit extends ElementPositionUnit> extends GeometryRectangle<Unit> {}
