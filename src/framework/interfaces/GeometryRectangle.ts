import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type HasElementPosition from "src/framework/interfaces/HasElementPosition";
import type HasElementSize from "src/framework/interfaces/HasElementSize";

export default interface GeometryRectangle<Unit extends ElementPositionUnit> extends HasElementPosition<Unit>, HasElementSize<Unit> {}
