import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type GeometryRectangle from "src/framework/interfaces/GeometryRectangle";

export default interface ElementBoundingBox<Unit extends ElementPositionUnit> extends GeometryRectangle<Unit> {}
