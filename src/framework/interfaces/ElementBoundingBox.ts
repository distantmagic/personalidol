import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import GeometryRectangle from "src/framework/interfaces/GeometryRectangle";

export default interface ElementBoundingBox<Unit extends ElementPositionUnit> extends GeometryRectangle<Unit> {}
